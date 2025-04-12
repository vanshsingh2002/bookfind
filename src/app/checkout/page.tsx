"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/card-store";
import { Trash2 } from "lucide-react";

export default function CheckoutPage() {
  const { items, removeFromCart, clearCart } = useCart();

  const totalPrice = items.reduce((sum, book) => sum + book.price, 0);

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

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
