// src/ai/flows/review-analyzer.ts
'use server';
/**
 * @fileOverview Analyzes book reviews and suggests related books.
 *
 * - analyzeReviewAndSuggestBooks - A function that analyzes a book review and suggests related books.
 * - AnalyzeReviewAndSuggestBooksInput - The input type for the analyzeReviewAndSuggestBooks function.
 * - AnalyzeReviewAndSuggestBooksOutput - The return type for the analyzeReviewAndSuggestBooks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeReviewAndSuggestBooksInputSchema = z.object({
  reviewText: z.string().describe('The text content of the book review.'),
  currentBookTitle: z.string().describe('The title of the book being reviewed.')
});
export type AnalyzeReviewAndSuggestBooksInput = z.infer<typeof AnalyzeReviewAndSuggestBooksInputSchema>;

const AnalyzeReviewAndSuggestBooksOutputSchema = z.object({
  suggestedBooks: z
    .array(z.string())
    .describe('A list of titles of books suggested based on the review.'),
});
export type AnalyzeReviewAndSuggestBooksOutput = z.infer<typeof AnalyzeReviewAndSuggestBooksOutputSchema>;

export async function analyzeReviewAndSuggestBooks(
  input: AnalyzeReviewAndSuggestBooksInput
): Promise<AnalyzeReviewAndSuggestBooksOutput> {
  return analyzeReviewAndSuggestBooksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeReviewAndSuggestBooksPrompt',
  input: {schema: AnalyzeReviewAndSuggestBooksInputSchema},
  output: {schema: AnalyzeReviewAndSuggestBooksOutputSchema},
  prompt: `You are a book recommendation expert. Based on the content of the following book review, suggest other books that the reviewer might enjoy.  The review is for the book "{{{currentBookTitle}}}".

Review Text: {{{reviewText}}}

Suggest books that are similar in theme, style, or target audience.  Do not suggest "{{{currentBookTitle}}}" in your output.

Output ONLY an array of book titles. No other text.`, 
});

const analyzeReviewAndSuggestBooksFlow = ai.defineFlow(
  {
    name: 'analyzeReviewAndSuggestBooksFlow',
    inputSchema: AnalyzeReviewAndSuggestBooksInputSchema,
    outputSchema: AnalyzeReviewAndSuggestBooksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
