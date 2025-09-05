import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="page">
      <h1>Welcome to BookWorm Library</h1>
      <p>Your friendly library management frontend — simple, clean, and ready to connect to your backend.</p>
      <Link to="/books" className="btn">Browse Books</Link>
    </div>
  );
}
