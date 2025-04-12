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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function AddBookPage() {
  const [user, setUser] = useState<any>(null);
  const [mode, setMode] = useState("Exchange");
  const router = useRouter();
  const { items } = useCart();

  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    email: "",
    phone: "",
    location: "",
    price: "",
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return router.push("/login");
    setUser(JSON.parse(userData));
  }, []);

  const validateForm = () => {
    const newErrors: any = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.author.trim()) newErrors.author = "Author is required";
    if (!form.genre.trim()) newErrors.genre = "Genre is required";
    if (!form.location.trim()) newErrors.location = "Location is required";
    if (!form.email.trim() && !form.phone.trim()) {
      newErrors.email = "Email or phone is required";
      newErrors.phone = "Email or phone is required";
    }
    if (mode === "Rent") {
      if (!form.price.trim() || isNaN(Number(form.price))) {
        newErrors.price = "Valid price is required for rent";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      ...form,
      price: mode === "Rent" ? Number(form.price) : 0,
      mode,
      userId: user._id,
    };

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast("Book added successfully.");
      router.push("/dashboard");
    } else {
      toast.error("Failed to add book.");
    }
  };

  if (!user) return null;

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setErrors({ ...errors, [key]: undefined });
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

        <div className="p-6 w-full md:w-1/2 mx-auto">
          <Card className="rounded-2xl shadow-md border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Add a New Book</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {["title", "author", "genre", "location", "email", "phone"].map((field) => (
                  <div key={field} className="grid w-full items-center gap-1.5">
                    <Label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <Input
                      id={field}
                      placeholder={`Enter ${field}`}
                      value={(form as any)[field]}
                      onChange={(e) => handleChange(field, e.target.value)}
                    />
                    {errors[field] && <p className="text-sm text-red-500">{errors[field]}</p>}
                  </div>
                ))}

                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="mode">Mode</Label>
                  <select
                    id="mode"
                    className="w-full p-2 border rounded"
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                  >
                    <option value="Rent">Rent</option>
                    <option value="Exchange">Exchange</option>
                  </select>
                </div>

                {mode === "Rent" && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="₹0 for free"
                      value={form.price}
                      onChange={(e) => handleChange("price", e.target.value)}
                    />
                    {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
                  </div>
                )}

                <Button type="submit" className="w-full cursor-pointer mt-4">
                  Add Book
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
