"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/lib/card-store";
import { toast } from "sonner";

interface Book {
  id: string;
  title: string;
  price: number;
  genre: string;
  location: string;
  author: string;
  mode: string;
  email?: string;
  phone?: string;
}

export default function BookCard({ book }: { book: Book }) {
  const { addToCart } = useCart();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [exchangeName, setExchangeName] = useState("");
  const [offeredBook, setOfferedBook] = useState("");
  const [notes, setNotes] = useState("");

  const handleRent = () => {
    addToCart(book);
    toast.success(`${book.title} added to your cart.`);
  };

  const handleExchangeSubmit = () => {
    toast.success("Exchange request sent!");
    setExchangeName("");
    setOfferedBook("");
    setNotes("");
    setIsDialogOpen(false);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-md transition hover:shadow-xl rounded-2xl relative">
      {/* Header */}
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{book.title}</CardTitle>
      </CardHeader>

      {/* Details */}
      <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">Author:</span> {book.author}
        </div>
        <div>
          <span className="font-medium text-foreground">Genre:</span>{" "}
          <span className="inline-block bg-muted px-2 py-0.5 rounded-md">
            {book.genre || "N/A"}
          </span>
        </div>
        <div>
          <span className="font-medium text-foreground">Location:</span>{" "}
          <span className="inline-block bg-muted px-2 py-0.5 rounded-md">
            {book.location}
          </span>
        </div>
        <div>
          <span className="font-medium text-foreground">Owner Info:</span>{" "}
          {book.email || book.phone || "Not Provided"}
        </div>
        {book.mode === "rent" || book.mode === "Rent" && (
          <span className="text-lg font-semibold text-primary">
            {book.price === 0 ? "Free" : `₹${book.price}`}
          </span>
        )}
      </CardContent>

      {/* Footer */}
      <CardFooter className="mt-auto flex items-center justify-between pt-4 gap-2">
        {(book.mode === "rent" || book.mode === "Rent") && (
          <Button
            size="sm"
            className="rounded-full px-4 cursor-pointer"
            onClick={handleRent}
          >
            Rent Now
          </Button>
        )}

        {(book.mode === "exchange" || book.mode === "Exchange") && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="rounded-full px-4 cursor-pointer"
                variant="outline"
              >
                Request Exchange
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Exchange Request</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-2">
                <Input
                  placeholder="Your Name"
                  value={exchangeName}
                  onChange={(e) => setExchangeName(e.target.value)}
                />
                <Input
                  placeholder="Book you're offering in exchange"
                  value={offeredBook}
                  onChange={(e) => setOfferedBook(e.target.value)}
                />
                <Textarea
                  placeholder="Additional notes (optional)"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <DialogFooter>
                <Button className="cursor-pointer" onClick={handleExchangeSubmit}>
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardFooter>
    </Card>
  );
}
