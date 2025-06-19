import { getFeaturedBooks } from '@/lib/actions';
import BookCard from '@/components/BookCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function HomePage() {
  const featuredBooks = await getFeaturedBooks();

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-secondary rounded-lg shadow-sm">
        <h1 className="text-5xl font-headline font-bold text-primary mb-4 animate-fade-in">
          Welcome to Lyrical Pages
        </h1>
        <p className="text-xl text-secondary-foreground mb-8 max-w-2xl mx-auto animate-fade-in-delay-200">
          Discover your next favorite book, share your thoughts, and connect with fellow readers.
        </p>
        <Link href="/books">
          <Button size="lg" className="animate-fade-in-delay-400">
            Explore Books <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-6 text-center text-primary">
          Featured Books
        </h2>
        {featuredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No featured books available at the moment. Check back soon!</p>
        )}
      </section>
    </div>
  );
}
