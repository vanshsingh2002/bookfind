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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import BookCard from "@/components/BookCard";

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
  const [editBook, setEditBook] = useState<Book | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    author: "",
    genre: "",
    location: "",
    price: 0,
  });
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
    setBooks(data);
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

  const handleEdit = (book: Book) => {
    setEditBook(book);
    setEditForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      location: book.location,
      price: book.price,
    });
  };

  const submitEdit = async () => {
    if (!editBook) return;
    const res = await fetch(`/api/books/${editBook.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...editForm }),
    });

    if (res.ok) {
      toast.success("Book updated");
      fetchBooks();
      setEditBook(null);
    } else {
      toast.error("Failed to update");
    }
  };

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
        <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <div key={book.id} className="relative">
              <BookCard book={book} />

              {user?.email === book.email && (
                <div className="absolute top-2 right-2 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(book)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Book</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3 py-2">
                        <Input
                          value={editForm.title}
                          onChange={(e) =>
                            setEditForm({ ...editForm, title: e.target.value })
                          }
                          placeholder="Title"
                        />
                        <Input
                          value={editForm.author}
                          onChange={(e) =>
                            setEditForm({ ...editForm, author: e.target.value })
                          }
                          placeholder="Author"
                        />
                        <Input
                          value={editForm.genre}
                          onChange={(e) =>
                            setEditForm({ ...editForm, genre: e.target.value })
                          }
                          placeholder="Genre"
                        />
                        <Input
                          value={editForm.location}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              location: e.target.value,
                            })
                          }
                          placeholder="Location"
                        />
                        <Input
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              price: Number(e.target.value),
                            })
                          }
                          placeholder="Price"
                          type="number"
                        />
                      </div>
                      <Button onClick={submitEdit}>Update</Button>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(book.id)}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
