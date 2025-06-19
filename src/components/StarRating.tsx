"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';

interface StarRatingProps {
  rating: number;
  size?: number;
  className?: string;
  onRatingChange?: (rating: number) => void;
  interactive?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 20,
  className,
  onRatingChange,
  interactive = false,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (interactive) {
      setHoverRating(index);
    }
  };

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0);
    }
  };

  return (
    <div className={cn("flex items-center", className)} aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((index) => {
        const fillClass = interactive
          ? (hoverRating || rating) >= index ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground fill-muted-foreground/50'
          : rating >= index ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground fill-muted-foreground/50';
        
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              'transition-colors',
              fillClass,
              interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            )}
            onClick={() => handleClick(index)}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            aria-hidden="true" 
          />
        );
      })}
    </div>
  );
};

export default StarRating;
