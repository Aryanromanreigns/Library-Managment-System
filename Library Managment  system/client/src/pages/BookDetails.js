import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBookById, borrowBook } from "../api/api";

export default function BookDetails({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await getBookById(id);
        setBook(res.data.book || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleBorrow = async () => {
    if (!user) {
      setMessage("Please login to borrow books.");
      return;
    }
    try {
      await borrowBook(id, user.email);
      setMessage("Borrowed successfully. Refresh the page to see updates.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Borrow failed.");
    }
  };

  if (loading) return <div className="center">Loading...</div>;
  if (!book) return <div>Book not found</div>;

  return (
    <div className="page">
      <h2>{book.title}</h2>
      <p className="muted">By {book.author}</p>
      <p>{book.description}</p>
      <p><strong>Price:</strong> ${book.price}</p>
      <p><strong>Available:</strong> {book.availability ? "Yes" : "No"}</p>

      <div style={{ marginTop: 12 }}>
        <button className="btn" onClick={handleBorrow} disabled={!book.availability}>Borrow</button>
      </div>
      {message && <p className="info">{message}</p>}
    </div>
  );
}
