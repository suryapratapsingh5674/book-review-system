
import type { Book } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import StarRating from './StarRating';
import { MessageCircle } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  // Generate a hint based on book title or genre for better AI image suggestions
  const generateAiHint = (book: Book): string => {
    if (book.title.toLowerCase().includes("library")) return "library fantasy";
    if (book.title.toLowerCase().includes("hail mary")) return "astronaut space";
    if (book.title.toLowerCase().includes("klara")) return "robot sun";
    if (book.title.toLowerCase().includes("vanishing")) return "sisters silhouette";
    if (book.title.toLowerCase().includes("atomic habits")) return "brain gears";
    if (book.title.toLowerCase().includes("achilles")) return "greek warrior";
    if (book.genre.length > 0) return book.genre[0].toLowerCase().replace(/\s+/g, ''); // first genre
    return "book cover"; // fallback
  }

  return (
    <Link href={`/books/${book.id}`} className="group block" aria-label={`View details for ${book.title}`}>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
        <CardHeader className="p-0 relative">
          <Image
            src={book.coverImage} // Base URL from mockData
            alt={`Cover of ${book.title}`}
            width={300}
            height={450}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            data-ai-hint={generateAiHint(book)}
          />
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="font-headline text-xl mb-1 leading-tight truncate group-hover:text-primary transition-colors">
            {book.title}
          </CardTitle>
          <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
          <div className="flex flex-wrap gap-1 mb-2">
            {book.genre.slice(0,2).map((g) => (
              <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center text-sm">
          <StarRating rating={book.averageRating} size={16} />
           <div className="flex items-center text-muted-foreground">
            <MessageCircle size={14} className="mr-1" />
            <span>{book.reviewsCount || 0}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
