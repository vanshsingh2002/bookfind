import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/user";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const exists = await User.findOne({ email: body.email });
  if (exists) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const user = await User.create(body);
  return NextResponse.json({ success: true, user });
}

export async function GET() {
  await connectDB();
  const users = await User.find();
  return NextResponse.json(users);
}
