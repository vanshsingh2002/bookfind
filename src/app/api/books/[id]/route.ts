// app/api/books/[id]/route.ts

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/app/models/book";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deletedBook = await Book.findByIdAndDelete(params.id);

    if (!deletedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Delete book error:", error);
    return NextResponse.json({ error: "Failed to delete book" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

    const updatedBook = await Book.findByIdAndUpdate(
      params.id,
      { ...body },
      { new: true }
    );

    if (!updatedBook) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("Update book error:", error);
    return NextResponse.json({ error: "Failed to update book" }, { status: 500 });
  }
}
