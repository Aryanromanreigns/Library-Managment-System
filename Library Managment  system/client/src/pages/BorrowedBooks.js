import React, { useEffect, useState } from "react";
import { getBorrowedByUser } from "../api/api";

export default function BorrowedBooks({ user }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBorrowedByUser();
        // backend returns borrowedBooks or borrowedbooks - handle both
        setList(res.data.borrowedBooks || res.data.borrowedbooks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="center">Loading...</div>;

  return (
    <div className="page">
      <h2>My Borrowed Books</h2>
      {list.length === 0 ? (
        <p>You have no borrowed books.</p>
      ) : (
        <div className="list">
          {list.map((b, idx) => (
            <div key={idx} className="borrow-row">
              <div><strong>{b.bookTitle || b.booktitle || "Unknown"}</strong></div>
              <div>Borrowed: {new Date(b.borrowedDate || b.borrowDate || "").toLocaleString()}</div>
              <div>Due: {new Date(b.dueDate || "").toLocaleString()}</div>
              <div>Returned: {b.returned ? "Yes" : "No"}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
