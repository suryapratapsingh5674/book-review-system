import type { Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import StarRating from './StarRating';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const timeAgo = formatDistanceToNow(new Date(review.createdAt), { addSuffix: true });

  return (
    <Card className="mb-4 bg-secondary shadow-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
               <AvatarImage src={`https://avatar.vercel.sh/${review.username}.png`} alt={review.username} data-ai-hint="profile avatar"/>
               <AvatarFallback>{review.username.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-base font-semibold text-primary">{review.username}</CardTitle>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
          <StarRating rating={review.rating} size={18} />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-foreground leading-relaxed">{review.reviewText}</p>
      </CardContent>
    </Card>
  );
}
