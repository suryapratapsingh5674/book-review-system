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
  return (
    <Link href={`/books/${book.id}`} className="group block" aria-label={`View details for ${book.title}`}>
      <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-lg">
        <CardHeader className="p-0 relative">
          <Image
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            width={300}
            height={450}
            className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            data-ai-hint="book cover"
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
