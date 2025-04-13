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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Switch } from "./ui/switch";

interface Book {
  id: string;
  title: string;
  price: number;
  genre: string;
  location: string;
  author: string;
  isRented: boolean;
  listingType: string;
  email?: string;
  phone?: string;
  owner: string;
}

export default function ListingCard({
  book,
  onDelete,
  onUpdate,
}: {
  book: Book;
  onDelete?: (id: string) => void;
  onUpdate?: (updatedBook: Book) => void | Promise<void>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form, setForm] = useState<Book>({ ...book });
  const [mode, setMode] = useState(book.listingType?.toLowerCase());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleDelete = () => {
    if (onDelete) {
      onDelete(book.id);
    }
  };

  const handleChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.title) newErrors.title = "Title is required.";
    if (!form.author) newErrors.author = "Author is required.";
    if (!form.genre.trim()) newErrors.genre = "Genre is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!(form.email?.trim() || form.phone?.trim())) {
      newErrors.email = "Email or phone is required";
      newErrors.phone = "Email or phone is required";
    }
    if (mode === "Rent" && (!form.price || Number(form.price) < 0)) {
      newErrors.price = "Enter valid price.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const updatedBook: Book = {
      ...form,
      listingType: mode,
      price: mode === "Rent" ? Number(form.price) : 0,
    };

    if (onUpdate) {
      onUpdate(updatedBook);
    }
    setIsDialogOpen(false);
  };

  return (
    <Card className="flex flex-col overflow-hidden shadow-md hover:shadow-xl rounded-2xl relative">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-semibold">{book.title}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-1 text-sm text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">Author:</span>{" "}
          {book.author}
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
        {book.listingType === "rent" && (
          <span className="text-lg font-semibold text-primary">
            {book.price === 0 ? "Free" : `₹${book.price}`}
          </span>
        )}
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between pt-4 gap-2">
        <Button
          size="sm"
          className="rounded-full px-4 cursor-pointer"
          onClick={handleDelete}
        >
          Delete
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="rounded-full px-4 cursor-pointer"
              variant="outline"
              disabled={book.isRented}
            >
              Edit
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Book</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {["title", "author", "genre", "location", "email", "phone"].map(
                (field) => (
                  <div key={field} className="grid w-full items-center gap-1.5">
                    <Label htmlFor={field}>
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                    </Label>
                    <Input
                      id={field}
                      value={(form as any)[field] || ""}
                      onChange={(e) => handleChange(field, e.target.value)}
                    />
                    {errors[field] && (
                      <p className="text-sm text-red-500">{errors[field]}</p>
                    )}
                  </div>
                )
              )}

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="mode">Mode</Label>
                <select
                  id="mode"
                  className="w-full p-2 border rounded"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="rent">Rent</option>
                  <option value="exchange">Exchange</option>
                </select>
              </div>

              {mode === "rent" && (
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                  />
                  {errors.price && (
                    <p className="text-sm text-red-500">{errors.price}</p>
                  )}
                </div>
              )}

              <DialogFooter>
                <Button type="submit" className="w-full cursor-pointer mt-2">
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
