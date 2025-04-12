"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ShoppingCart } from "lucide-react";
import { Input } from "@/components/ui/input";
import BookCard from "@/components/BookCard";
import { dummyBooks } from "@/lib/dummy";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCart } from "@/lib/card-store";
import { useRouter } from "next/navigation";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const { items } = useCart();

  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
      router.push('/login');
    }
  }, []);

  // 💡 Fixed list of genres
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

  // 🔍 Filter logic
  const filteredBooks = dummyBooks.filter((book) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.location.toLowerCase().includes(query);

    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  return (
    <SidebarProvider>
     <AppSidebar
  user={{
    name: "John Doe",
    email: "john@example.com",
    avatar: "/avatars/john.jpg",
    role: "Owner", // Replace with actual role from session or store
  }}
/>
      <SidebarInset>
        {/* Header */}
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 px-4 py-2 border-b bg-white dark:bg-black dark:border-neutral-800">
          {/* Sidebar Trigger */}
          <SidebarTrigger className="cursor-pointer" />

          {/* Search Input */}
          <div className="flex-1 max-w-xl w-full">
            <Input
              type="text"
              placeholder="Search by title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Fixed Genre Filter */}
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

          {/* Cart */}
          <a href="/checkout" className="relative">
            <ShoppingCart className="w-6 h-6" />
            {items.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-primary text-white text-xs px-1.5 rounded-full">
                {items.length}
              </span>
            )}
          </a>
        </header>

        {/* Books Grid */}
        <div className="grid gap-6 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book) => <BookCard key={book.id} book={book} />)
          ) : (
            <p className="col-span-full text-center text-muted-foreground text-sm mt-10">
              No books available for the selected genre.
            </p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
