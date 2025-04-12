import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Book from "@/app/models/book";

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const book = await Book.create(body);
    return NextResponse.json(book);
  } catch (error) {
    console.error("Add book error:", error);
    return NextResponse.json({ error: "Failed to add book" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const books = await Book.find();
    return NextResponse.json(books);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 });
  }
}
