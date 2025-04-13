'use client';

import { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ShoppingCart } from 'lucide-react';
import { Input } from '@/components/ui/input';
import BookCard from '@/components/BookCard';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useCart } from '@/lib/card-store';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [books, setBooks] = useState<{ title: string; location: string; genre: string; _id: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { items } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchBooks = async () => {
      try {
        const res = await fetch(`/api/books?userId=${user.id}`);
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error("Failed to fetch books:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooks();
  }, [user, router]);

  const fixedGenres = [
    "All",
    "Action",
    "Horror",
    "Romance",
    "Fiction",
    "Mystery",
    "Fantasy",
    "Sci-Fi",
  ];

  const filteredBooks = books.filter((book) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.location.toLowerCase().includes(query);

    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <SidebarProvider>
        <AppSidebar
          user={{
            name: user.name,
            email: user.email,
            role: user.role === "Owner" || user.role === "Seeker" ? user.role : "Seeker",
          }}
        />
        <SidebarInset>
          {/* Skeleton for header */}
          <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-b bg-white dark:bg-black dark:border-neutral-800">
            <Skeleton className="h-6 w-6 rounded-full" />
            
            <div className="flex-1 max-w-xl w-full">
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="w-40">
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="relative">
              <Skeleton className="h-6 w-6 rounded-full" />
            </div>
          </header>

          {/* Skeleton for book grid */}
          <div className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="space-y-3">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[80%]" />
                  <Skeleton className="h-4 w-[60%]" />
                  <Skeleton className="h-4 w-[40%]" />
                </div>
              </div>
            ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        user={{
          name: user.name,
          email: user.email,
          role: user.role === "Owner" || user.role === "Seeker" ? user.role : "Seeker",
        }}
      />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-b bg-white dark:bg-black dark:border-neutral-800">
          <SidebarTrigger className="cursor-pointer" />

          <div className="flex-1 max-w-xl w-full">
            <Input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="w-40">
            <Select value={selectedGenre} onValueChange={setSelectedGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by genre" />
              </SelectTrigger>
              <SelectContent>
                {fixedGenres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <a href="/checkout" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-xs px-1.5 rounded-full">
                {items.length}
              </span>
            )}
          </a>
        </header>

        <div className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book: any) => (
              <BookCard key={book._id} book={book} />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground text-sm mt-10">
              No books available
            </p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}