# Book Rental & Exchange Platform

## 📖 Overview
A web application for renting and exchanging books between users. The platform allows book owners to list their books and seekers to browse, search, and rent/exchange books.

## ✨ Features

### 🔑 Authentication
- User registration and login
- Protected routes for authenticated users
- Role-based access (Owner/Seeker)

### 📚 Book Management
- Add new books with details (title, author, genre, price, etc.)
- Edit existing book listings
- Delete book listings
- Filter books by genre
- Search books by title or location

### 🛒 Cart & Checkout
- Add books to cart
- Remove books from cart
- View cart summary
- Calculate total price
- Confirm rental

### 🏠 Dashboard
- View all available books
- Responsive grid layout
- Loading states with skeleton UI
- Search and filter functionality

### 🧩 Additional Features
- Back button navigation
- Loading indicators
- Form validation
- Toast notifications
- Responsive design

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-rental-app.git
   cd book-rental-app
2. Install dependencies:
    ```bash
   npm install
    or
   yarn install
3. Create a .env file in the root directory with your environment variables:
    ```bash
   MONGODB_URI=your_mongodb_connection_string
4. Run the development server:
    ```bash
   npm run dev
    or
   yarn dev
    
## ✅ What's Working
- All core features listed above
- Responsive design for mobile and desktop
- Form validations
- Authentication flow
- Cart functionality

## 🚧 What's Not Working/Planned
- Book rating and reviews
- User profile pages
- Book Cover Image

## 🎁 Bonus Features
- Skeleton loading states for better UX
- Animated transitions
- Persistent cart using local storage
- Comprehensive form validation

## 🤖 AI Tools Used
- ChatGPT for debugging assistance and code optimization
- Deepseek code reviews for quality assurance
