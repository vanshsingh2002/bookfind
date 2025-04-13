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
  const { items } = useCart();

  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return router.push("/login");
    setUser(JSON.parse(userData));
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    const res = await fetch("/api/books");
    const data = await res.json();
    const formatted = data.map((book: any) => ({
      ...book,
      id: book._id,
    }));
    setBooks(formatted);
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

  
console.log(books);
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
          {books.map((book) => (
            <div key={book.id} className="relative">
              <ListingCard
                book={book}
                onDelete={handleDelete}
                onUpdate={handleEdit}
              />
            </div>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
