import type { Book, Review } from '@/lib/types';

export const mockUsers = [
  { id: 'user1', username: 'BookwormReader' },
  { id: 'user2', username: 'NovelLover23' },
  { id: 'user3', username: 'StorySeeker' },
];

export const mockBooks: Book[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: ['Fantasy', 'Contemporary'],
    summary: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived. To see how things would be if you had made other choices... Would you have done anything different, if you had the chance to undo your regrets?',
    coverImage: 'https://placehold.co/300x450.png',
    averageRating: 4.5,
    featured: true,
    aiInsight: 'Readers who enjoyed this book often explore themes of regret, second chances, and philosophical questions about life choices.',
    reviewsCount: 2,
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: ['Science Fiction', 'Thriller'],
    summary: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn’t know that. He can’t even remember his own name, let alone the nature of his assignment or how to complete it.',
    coverImage: 'https://placehold.co/300x450.png',
    averageRating: 4.8,
    featured: true,
    aiInsight: 'Fans of hard science fiction, witty protagonists, and interstellar problem-solving will find this novel highly engaging.',
    reviewsCount: 1,
  },
  {
    id: '3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: ['Science Fiction', 'Literary Fiction'],
    summary: 'Klara, an Artificial Friend with outstanding observational qualities, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside. She remains hopeful a customer will soon choose her.',
    coverImage: 'https://placehold.co/300x450.png',
    averageRating: 4.2,
    featured: false,
    aiInsight: 'This novel appeals to readers interested in artificial intelligence, human connection, and subtle dystopian undertones.',
    reviewsCount: 1,
  },
  {
    id: '4',
    title: 'The Vanishing Half',
    author: 'Brit Bennett',
    genre: ['Historical Fiction', 'Family Saga'],
    summary: 'The Vignes twin sisters will always be identical. But after growing up together in a small, southern black community and running away at age sixteen, it\'s not justthe shape of their daily lives that is different as adults, it\'s everything: their families, their communities, their racial identities.',
    coverImage: 'https://placehold.co/300x450.png',
    averageRating: 4.6,
    featured: true,
    aiInsight: 'This book resonates with those who appreciate multi-generational stories exploring identity, race, and family secrets.',
    reviewsCount: 0,
  },
  {
    id: '5',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: ['Self-Help', 'Productivity'],
    summary: 'An easy and proven way to build good habits and break bad ones. James Clear, one of the world\'s leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.',
    coverImage: 'https://placehold.co/300x450.png',
    averageRating: 4.9,
    featured: false,
    aiInsight: 'A must-read for individuals seeking actionable advice on personal development and achieving long-term goals through small changes.',
    reviewsCount: 0,
  },
  {
    id: '6',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    genre: ['Historical Fiction', 'Mythology', 'LGBTQ+'],
    summary: 'A tale of gods, kings, immortal fame, and the human heart, The Song of Achilles is a dazzling literary feat that brilliantly reimagines Homer’s enduring masterwork, The Iliad. An action-packed adventure, an epic love story, a marvel!',
    coverImage: 'https://placehold.co/300x450.png',
    averageRating: 4.7,
    aiInsight: 'Perfect for readers who love mythological retellings with deep emotional focus and compelling character relationships.',
    reviewsCount: 0,
  }
];

export const mockReviews: Review[] = [
  {
    id: 'r1',
    bookId: '1',
    userId: 'user1',
    username: 'BookwormReader',
    rating: 5,
    reviewText: 'Absolutely loved this book! The concept was fascinating and it made me think a lot about my own life choices. Highly recommend.',
    createdAt: '2023-05-10T10:00:00Z',
  },
  {
    id: 'r2',
    bookId: '1',
    userId: 'user2',
    username: 'NovelLover23',
    rating: 4,
    reviewText: 'A thought-provoking read. Some parts were a bit slow, but the overall message was powerful. The library concept is unique.',
    createdAt: '2023-05-12T14:30:00Z',
  },
  {
    id: 'r3',
    bookId: '2',
    userId: 'user1',
    username: 'BookwormReader',
    rating: 5,
    reviewText: 'Andy Weir does it again! Project Hail Mary is a thrilling, hilarious, and surprisingly heartwarming sci-fi adventure. Couldn\'t put it down.',
    createdAt: '2023-06-01T09:15:00Z',
  },
  {
    id: 'r4',
    bookId: '3',
    userId: 'user3',
    username: 'StorySeeker',
    rating: 4,
    reviewText: 'Ishiguro\'s writing is beautiful as always. Klara is a compelling narrator, and the story raises interesting questions about love and humanity.',
    createdAt: '2023-04-20T11:00:00Z',
  },
];

// Function to add a new review (simulates backend)
export const addMockReview = (review: Omit<Review, 'id' | 'createdAt' | 'username'>): Review => {
  const user = mockUsers.find(u => u.id === review.userId);
  const newReview: Review = {
    ...review,
    id: `r${mockReviews.length + 1}`,
    createdAt: new Date().toISOString(),
    username: user ? user.username : "Anonymous"
  };
  mockReviews.push(newReview);

  // Update book's average rating and reviews count
  const book = mockBooks.find(b => b.id === review.bookId);
  if (book) {
    const bookReviews = mockReviews.filter(r => r.bookId === book.id);
    const totalRating = bookReviews.reduce((sum, r) => sum + r.rating, 0);
    book.averageRating = parseFloat((totalRating / bookReviews.length).toFixed(1));
    book.reviewsCount = bookReviews.length;
  }
  return newReview;
};

// Add data-ai-hint to cover images
mockBooks.forEach(book => {
  book.coverImage = `${book.coverImage}?data-ai-hint=book+cover`;
});
