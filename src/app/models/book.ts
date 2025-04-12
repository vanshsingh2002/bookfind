import mongoose from "mongoose";

const BookSchema = new mongoose.Schema(
  {
    title: String,
    author: String,
    genre: String,
    email: String,
    phone: String,
    location: String,
    mode: { type: String, enum: ["Rent", "Exchange"] },
    price: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export default mongoose.models.Book || mongoose.model("Book", BookSchema);
