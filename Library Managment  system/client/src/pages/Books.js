import React, { useEffect, useState } from "react";
import { getAllBooks } from "../api/api";
import BookCard from "../components/Bookcard";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAllBooks();
        setBooks(res.data.books || []);
      } catch (err) {
        console.error("Error fetching books:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="center">Loading books...</div>;

  return (
    <div className="page">
      <h2>All Books</h2>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="grid">
          {books.map((b) => (
            <BookCard key={b._id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
