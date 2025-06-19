"use client";

import { useEffect, useState, useTransition } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Book } from '@/lib/types';
import { getBooks, type GetBooksFilters } from '@/lib/actions';
import BookCard from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X as ClearIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const BOOKS_PER_PAGE = 8;

export default function BookListingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const [books, setBooks] = useState<Book[]>([]);
  const [totalBooks, setTotalBooks] = useState(0);
  const [genres, setGenres] = useState<string[]>([]);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('title') || '');
  const [authorFilter, setAuthorFilter] = useState(searchParams.get('author') || '');
  const [genreFilter, setGenreFilter] = useState(searchParams.get('genre') || 'all');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const fetchInitialData = async () => {
      startTransition(async () => {
        const filters: GetBooksFilters = {
          title: searchParams.get('title') || undefined,
          author: searchParams.get('author') || undefined,
          genre: searchParams.get('genre') === 'all' ? undefined : searchParams.get('genre') || undefined,
          page: Number(searchParams.get('page')) || 1,
          limit: BOOKS_PER_PAGE,
        };
        const { books: fetchedBooks, total, genres: fetchedGenres } = await getBooks(filters);
        setBooks(fetchedBooks);
        setTotalBooks(total);
        setGenres(fetchedGenres);
      });
    };
    fetchInitialData();
  }, [searchParams]);

  const handleFilterChange = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) params.set('title', searchTerm); else params.delete('title');
    if (authorFilter) params.set('author', authorFilter); else params.delete('author');
    if (genreFilter !== 'all') params.set('genre', genreFilter); else params.delete('genre');
    params.set('page', '1'); // Reset to first page on filter change
    
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setAuthorFilter('');
    setGenreFilter('all');
    setCurrentPage(1);
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };
  
  const totalPages = Math.ceil(totalBooks / BOOKS_PER_PAGE);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-headline font-bold text-primary text-center">Explore Our Collection</h1>
      
      <Card className="shadow-lg">
        <CardContent className="p-6 space-y-4 md:space-y-0 md:flex md:flex-wrap md:gap-4 md:items-end">
          <div className="flex-grow md:flex-1 min-w-[200px]">
            <label htmlFor="search-title" className="block text-sm font-medium text-muted-foreground mb-1">Search by Title</label>
            <Input
              id="search-title"
              type="text"
              placeholder="e.g., The Great Gatsby"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="flex-grow md:flex-1 min-w-[200px]">
            <label htmlFor="search-author" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Author</label>
            <Input
              id="search-author"
              type="text"
              placeholder="e.g., F. Scott Fitzgerald"
              value={authorFilter}
              onChange={(e) => setAuthorFilter(e.target.value)}
              className="h-10"
            />
          </div>
          <div className="flex-grow md:flex-1 min-w-[150px]">
            <label htmlFor="filter-genre" className="block text-sm font-medium text-muted-foreground mb-1">Filter by Genre</label>
            <Select value={genreFilter} onValueChange={setGenreFilter}>
              <SelectTrigger id="filter-genre" className="h-10">
                <SelectValue placeholder="Select genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map(genre => (
                  <SelectItem key={genre} value={genre.toLowerCase()}>{genre}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 pt-4 md:pt-0">
            <Button onClick={handleFilterChange} className="h-10 w-full md:w-auto" disabled={isPending}>
              <Search className="mr-2 h-4 w-4" /> Apply Filters
            </Button>
            <Button onClick={clearFilters} variant="outline" className="h-10 w-full md:w-auto" disabled={isPending}>
              <ClearIcon className="mr-2 h-4 w-4" /> Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {isPending ? (
         <div className="flex justify-center items-center min-h-[300px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
         </div>
      ) : books.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || isPending}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNumber => (
                <Button
                  key={pageNumber}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  size="icon"
                  onClick={() => handlePageChange(pageNumber)}
                  disabled={isPending}
                  aria-label={`Go to page ${pageNumber}`}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </Button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || isPending}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <p className="text-center text-muted-foreground text-lg col-span-full py-10">
          No books found matching your criteria. Try adjusting your filters.
        </p>
      )}
    </div>
  );
}
