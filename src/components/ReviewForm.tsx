"use client";

import { useState, useTransition } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './StarRating';
import { useAuth } from '@/contexts/AuthContext';
import { submitReview, getAiBookSuggestions } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Loader2 } from 'lucide-react';
import AiSuggestionsModal from './AiSuggestionsModal';
import Link from 'next/link';

const reviewSchema = z.object({
  rating: z.number().min(1, "Rating is required").max(5),
  reviewText: z.string().min(10, "Review must be at least 10 characters long").max(2000, "Review must be 2000 characters or less."),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  bookId: string;
  bookTitle: string; // For AI suggestions
  onReviewSubmitted: () => void; // Callback to refresh reviews list
}

export default function ReviewForm({ bookId, bookTitle, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, startTransition] = useTransition();
  const [showAiSuggestionsModal, setShowAiSuggestionsModal] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  
  const { control, handleSubmit, reset, formState: { errors } } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      reviewText: '',
    },
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast({ title: "Authentication Error", description: "You must be logged in to submit a review.", variant: "destructive" });
      return;
    }

    startTransition(async () => {
      try {
        const newReview = await submitReview({ ...data, bookId, userId: user.id });
        toast({ title: "Review Submitted!", description: "Thank you for your feedback." });
        reset();
        onReviewSubmitted(); // Refresh reviews list

        // Get AI suggestions
        const suggestionsOutput = await getAiBookSuggestions({ reviewText: data.reviewText, currentBookTitle: bookTitle });
        setAiSuggestions(suggestionsOutput.suggestedBooks);
        setShowAiSuggestionsModal(true);

      } catch (error) {
        toast({ title: "Submission Failed", description: (error as Error).message || "Could not submit your review.", variant: "destructive" });
      }
    });
  };

  if (!user) {
    return (
      <Card className="mt-6 bg-secondary shadow">
        <CardContent className="p-6 text-center">
          <p className="text-secondary-foreground mb-3">Want to share your thoughts on this book?</p>
          <Link href="/login">
            <Button>Log in to Write a Review</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="mt-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-headline text-primary">Write Your Review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Your Rating</label>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <StarRating rating={field.value} onRatingChange={field.onChange} interactive size={28} />
                )}
              />
              {errors.rating && <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>}
            </div>

            <div>
              <label htmlFor="reviewText" className="block text-sm font-medium text-foreground mb-1">Your Review</label>
              <Controller
                name="reviewText"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="reviewText"
                    placeholder={`Share your thoughts on "${bookTitle}"...`}
                    className="min-h-[120px] resize-none"
                    {...field}
                  />
                )}
              />
              {errors.reviewText && <p className="text-sm text-destructive mt-1">{errors.reviewText.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Submit Review
            </Button>
          </form>
        </CardContent>
      </Card>
      <AiSuggestionsModal
        isOpen={showAiSuggestionsModal}
        onClose={() => setShowAiSuggestionsModal(false)}
        suggestions={aiSuggestions}
        currentBookTitle={bookTitle}
      />
    </>
  );
}
