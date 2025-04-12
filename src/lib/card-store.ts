import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Book {
  id: string;
  title: string;
  price: number;
}

interface CartState {
  items: Book[];
  addToCart: (book: Book) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (book) =>
        set((state) => {
          const exists = state.items.find((item) => item.id === book.id);
          if (exists) return state;
          return { items: [...state.items, book] };
        }),
      removeFromCart: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "book-cart", // Key in localStorage
    }
  )
);
