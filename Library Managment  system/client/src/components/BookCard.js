import React from "react";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <div className="card">
      <div className="card-body">
        <h3>{book.title}</h3>
        <p className="muted">By {book.author}</p>
        <p className="desc">
          {book.description?.slice(0, 120)}
          {book.description && book.description.length > 120 ? "..." : ""}
        </p>
        <div className="card-bottom">
          <strong>
            {book.price?.toFixed ? `$${book.price.toFixed(2)}` : `$${book.price}`}
          </strong>
          <Link to={`/books/${book._id}`} className="btn-inline">
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
