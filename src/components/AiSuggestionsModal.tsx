"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SuggestedBook } from "@/lib/types"; // Assuming SuggestedBook might evolve
import Link from "next/link";
import { Lightbulb, Search } from "lucide-react";

interface AiSuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestions: string[]; // Array of book titles
  currentBookTitle: string;
}

export default function AiSuggestionsModal({
  isOpen,
  onClose,
  suggestions,
  currentBookTitle,
}: AiSuggestionsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-2xl font-headline">
            <Lightbulb className="w-6 h-6 mr-2 text-yellow-400" />
            AI Book Suggestions
          </DialogTitle>
          <DialogDescription className="pt-2">
            Based on your review for "{currentBookTitle}", you might also enjoy these books:
          </DialogDescription>
        </DialogHeader>
        {suggestions.length > 0 ? (
          <ul className="space-y-3 py-4 max-h-60 overflow-y-auto">
            {suggestions.map((title, index) => (
              <li key={index} className="p-3 bg-secondary rounded-md shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-secondary-foreground">{title}</span>
                  {/* In a real app, this link would go to the book's page if it exists in our DB */}
                  <Link href={`/books?title=${encodeURIComponent(title)}`} passHref legacyBehavior>
                    <Button variant="outline" size="sm" onClick={onClose}>
                      <Search className="w-4 h-4 mr-1" /> Find
                    </Button>
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-muted-foreground">
            We couldn't generate specific suggestions at this time, but keep exploring!
          </p>
        )}
        <DialogFooter>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
