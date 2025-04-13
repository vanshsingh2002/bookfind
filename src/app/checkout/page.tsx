"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/card-store";
import { Trash2, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { items, removeFromCart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const totalPrice = items.reduce((sum, book) => sum + book.price, 0);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 space-y-4">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-[200px]" />
        </div>

        {[...Array(3)].map((_, index) => (
          <div key={index} className="flex justify-between items-center border p-4 rounded-lg">
            <div className="space-y-2">
              <Skeleton className="h-5 w-[150px]" />
              <Skeleton className="h-4 w-[80px]" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ))}

        <div className="text-right space-y-4">
          <Skeleton className="h-6 w-[120px] ml-auto" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.back()}
          className="cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Your Cart</h1>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((book) => (
            <div
              key={book.id}
              className="flex justify-between items-center border p-4 rounded-lg"
            >
              <div>
                <h2 className="font-medium">{book.title}</h2>
                <p className="text-sm text-muted-foreground">₹{book.price}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(book.id)}
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </Button>
            </div>
          ))}

          <div className="text-right font-semibold text-lg">
            Total: ₹{totalPrice}
          </div>

          <Button className="w-full mt-2 cursor-pointer" onClick={clearCart}>
            Confirm Rent
          </Button>
        </div>
      )}
    </div>
  );
}