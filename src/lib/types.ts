export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string[];
  summary: string;
  coverImage: string;
  averageRating: number;
  featured?: boolean;
  aiInsight?: string; // Short AI-generated insight for the book details page
  reviewsCount?: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  username: string; // Denormalized for easy display
  rating: number; // 1-5
  reviewText: string;
  createdAt: string; // ISO date string
}

export interface User {
  id: string;
  username: string;
  // email?: string; // Optional, depending on auth implementation
  // Add other profile fields as needed
}

// For AI book suggestions
export interface SuggestedBook {
  title: string;
  // Potentially add author or a brief reason for suggestion
}
