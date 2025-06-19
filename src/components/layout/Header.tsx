"use client";

import Link from 'next/link';
import { BookHeart } from 'lucide-react';
import UserNav from './UserNav';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/books', label: 'Browse Books' },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-primary hover:text-primary/80 transition-colors">
          <BookHeart className="w-8 h-8" />
          Lyrical Pages
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-lg text-foreground hover:text-primary transition-colors",
                pathname === link.href && "text-primary font-semibold"
              )}
            >
              {link.label}
            </Link>))}
          <UserNav />
        </nav>
      </div>
    </header>
  );
}
