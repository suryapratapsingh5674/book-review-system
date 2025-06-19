"use server";

import { mockBooks, mockReviews, addMockReview as mockAddReviewFn, mockUsers } from '@/data/mockData';
import type { Book, Review, User } from './types';
import { analyzeReviewAndSuggestBooks as aiAnalyzeReview } from '@/ai/flows/review-analyzer';
import type { AnalyzeReviewAndSuggestBooksInput, AnalyzeReviewAndSuggestBooksOutput } from '@/ai/flows/review-analyzer';

// Simulate database latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function getFeaturedBooks(): Promise<Book[]> {
  await delay(300);
  return mockBooks.filter(book => book.featured);
}

export interface GetBooksFilters {
  title?: string;
  author?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

export async function getBooks(filters: GetBooksFilters = {}): Promise<{books: Book[], total: number, genres: string[]}> {
  await delay(500);
  let filteredBooks = [...mockBooks];

  if (filters.title) {
    filteredBooks = filteredBooks.filter(book =>
      book.title.toLowerCase().includes(filters.title!.toLowerCase())
    );
  }
  if (filters.author) {
    filteredBooks = filteredBooks.filter(book =>
      book.author.toLowerCase().includes(filters.author!.toLowerCase())
    );
  }
  if (filters.genre && filters.genre !== 'all') {
    filteredBooks = filteredBooks.filter(book =>
      book.genre.map(g => g.toLowerCase()).includes(filters.genre!.toLowerCase())
    );
  }
  
  const allGenres = [...new Set(mockBooks.flatMap(book => book.genre))].sort();

  const total = filteredBooks.length;
  const page = filters.page || 1;
  const limit = filters.limit || 6; // Default to 6 books per page
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  return { books: filteredBooks.slice(startIndex, endIndex), total, genres: allGenres};
}

export async function getBookById(id: string): Promise<Book | undefined> {
  await delay(300);
  return mockBooks.find(book => book.id === id);
}

export async function getReviewsByBookId(bookId: string): Promise<Review[]> {
  await delay(400);
  return mockReviews.filter(review => review.bookId === bookId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function submitReview(reviewData: Omit<Review, 'id' | 'createdAt' | 'username'>): Promise<Review> {
  await delay(600);
  if (!reviewData.userId) throw new Error("User ID is required to submit a review.");
  // In a real app, validate data, save to DB, etc.
  const newReview = mockAddReviewFn(reviewData);
  return newReview;
}

export async function getAiBookSuggestions(input: AnalyzeReviewAndSuggestBooksInput): Promise<AnalyzeReviewAndSuggestBooksOutput> {
  await delay(1500); // Simulate AI processing time
  try {
    const result = await aiAnalyzeReview(input);
    // The GenAI flow might return titles that are identical to the current book.
    // Filter out the current book title from suggestions.
    if (result && result.suggestedBooks) {
      result.suggestedBooks = result.suggestedBooks.filter(
        title => title.toLowerCase() !== input.currentBookTitle.toLowerCase()
      );
    }
    return result;
  } catch (error) {
    console.error("Error getting AI book suggestions:", error);
    // Fallback or re-throw depending on desired error handling
    return { suggestedBooks: [] }; // Return empty array on error
  }
}

export async function getUserProfile(userId: string): Promise<User | undefined> {
  await delay(200);
  return mockUsers.find(user => user.id === userId);
}

// Placeholder for login, in a real app this would be more complex
export async function loginUser(username: string): Promise<User | null> {
  await delay(300);
  const user = mockUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (user) return user;
  
  // For demo, allow login with a username not in mockUsers by creating a temporary one
  // This part is more for client-side context in this setup.
  // If strict login is needed, return null if not found.
  return { id: `temp-${Date.now()}`, username };
}
