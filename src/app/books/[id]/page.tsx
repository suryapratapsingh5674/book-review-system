
"use client"; // For hooks like useState, useEffect

import { useEffect, useState, useCallback, useTransition } from 'react';
import { useParams } from 'next/navigation';
import type { Book, Review } from '@/lib/types';
import { getBookById, getReviewsByBookId } from '@/lib/actions';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import StarRating from '@/components/StarRating';
import ReviewCard from '@/components/ReviewCard';
import ReviewForm from '@/components/ReviewForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageSquareText, BookOpenText, Users, Lightbulb, Loader2 } from 'lucide-react';

export default function BookDetailsPage() {
  const params = useParams();
  const bookId = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, startLoadingTransition] = useTransition();
  const [isReviewsLoading, startReviewsLoadingTransition] = useTransition();


  const fetchBookData = useCallback(async () => {
    if (!bookId) return;
    startLoadingTransition(async () => {
      const fetchedBook = await getBookById(bookId);
      setBook(fetchedBook || null); // Ensure book is set to null if not found
      if (fetchedBook) {
        fetchReviews(); // Fetch reviews only if book is found
      }
    });
  }, [bookId]);

  const fetchReviews = useCallback(async () => {
    if (!bookId) return;
    startReviewsLoadingTransition(async () => {
      const fetchedReviews = await getReviewsByBookId(bookId);
      setReviews(fetchedReviews);
    });
  }, [bookId]);

  useEffect(() => {
    fetchBookData();
  }, [fetchBookData]);

  // Generate a hint based on book title or genre for better AI image suggestions
  const generateAiHint = (currentBook: Book | null): string => {
    if (!currentBook) return "book cover";
    if (currentBook.title.toLowerCase().includes("library")) return "library fantasy detail";
    if (currentBook.title.toLowerCase().includes("hail mary")) return "astronaut space detail";
    if (currentBook.title.toLowerCase().includes("klara")) return "robot sun detail";
    if (currentBook.title.toLowerCase().includes("vanishing")) return "sisters silhouette detail";
    if (currentBook.title.toLowerCase().includes("atomic habits")) return "brain gears detail";
    if (currentBook.title.toLowerCase().includes("achilles")) return "greek warrior detail";
    if (currentBook.genre.length > 0) return currentBook.genre[0].toLowerCase().replace(/\s+/g, '') + " detail";
    return "book cover detail"; // fallback
  }

  if (isLoading || !book && bookId) { // Show loader if initial book load is pending OR if bookId exists but book is not yet fetched
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive">Book not found</h1>
        <p className="text-muted-foreground">Sorry, we couldn't find the book you're looking for.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/3 relative">
            <Image
              src={book.coverImage}
              alt={`Cover of ${book.title}`}
              width={400}
              height={600}
              className="w-full h-auto object-cover md:rounded-l-lg"
              priority // Prioritize loading of the main book cover
              data-ai-hint={generateAiHint(book)}
            />
          </div>
          <div className="md:w-2/3">
            <CardHeader className="p-6">
              <CardTitle className="font-headline text-4xl text-primary mb-2">{book.title}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mb-3">by {book.author}</CardDescription>
              <div className="flex flex-wrap gap-2 mb-3">
                {book.genre.map((g) => (
                  <Badge key={g} variant="outline" className="text-sm">{g}</Badge>
                ))}
              </div>
              <div className="flex items-center gap-4">
                <StarRating rating={book.averageRating} size={24} />
                <span className="text-muted-foreground">({book.reviewsCount || reviews.length} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <h3 className="text-xl font-semibold mb-2 flex items-center"><BookOpenText className="w-5 h-5 mr-2 text-accent"/>Summary</h3>
              <p className="text-foreground leading-relaxed mb-6">{book.summary}</p>
              
              {book.aiInsight && (
                <>
                <Separator className="my-6" />
                <div className="bg-secondary p-4 rounded-md shadow-sm">
                  <h3 className="text-lg font-semibold mb-2 flex items-center text-secondary-foreground"><Lightbulb className="w-5 h-5 mr-2 text-yellow-400"/>AI Insight</h3>
                  <p className="text-sm text-secondary-foreground/90 italic">{book.aiInsight}</p>
                </div>
                </>
              )}
            </CardContent>
          </div>
        </div>
      </Card>

      <Separator className="my-10" />

      <section id="reviews" aria-labelledby="reviews-heading">
        <h2 id="reviews-heading" className="text-3xl font-headline font-semibold mb-6 flex items-center text-primary">
          <MessageSquareText className="w-7 h-7 mr-3"/>Community Reviews
        </h2>
        {isReviewsLoading && reviews.length === 0 ? (
          <div className="flex justify-center items-center min-h-[100px]">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">Be the first to review this book!</p>
        )}
      </section>
      
      <ReviewForm bookId={book.id} bookTitle={book.title} onReviewSubmitted={fetchReviews} />
    </div>
  );
}
