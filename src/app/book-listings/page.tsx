"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/card-store";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { toast } from "sonner";
import ListingCard from "@/components/ListingCard";
import { Skeleton } from "@/components/ui/skeleton"; // Import skeleton component

interface Book {
  id: string;
  title: string;
  price: number;
  genre: string;
  location: string;
  owner: string;
  author: string;
  isRented: boolean;
  listingType: string;
  email?: string;
  phone?: string;
}

export default function BookListingsPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const { items } = useCart();

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return router.push("/login");
    setUser(JSON.parse(userData));
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/books");
      const data = await res.json();
      const formatted = data.map((book: any) => ({
        ...book,
        id: book._id,
      }));
      setBooks(formatted);
    } catch (error) {
      toast.error("Failed to fetch books");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/books/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Book deleted");
      setBooks(books.filter((b) => b.id !== id));
    } else {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = async (updatedBook: Book) => {
    const res = await fetch(`/api/books/${updatedBook.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedBook),
    });
  
    if (res.ok) {
      toast.success("Book updated");
      fetchBooks();
    } else {
      toast.error("Failed to update book");
    }
  };

  // Skeleton loader component
  const BookSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-[200px] w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex justify-between items-center gap-4 px-4 py-2 border-b bg-background dark:border-neutral-800">
          <SidebarTrigger />
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
          {isLoading ? (
            // Show skeleton loaders while loading
            Array.from({ length: 8 }).map((_, index) => (
              <BookSkeleton key={index} />
            ))
          ) : books.length > 0 ? (
            books.map((book) => (
              <div key={book.id} className="relative">
                <ListingCard
                  book={book}
                  onDelete={handleDelete}
                  onUpdate={handleEdit}
                />
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No books available</p>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}