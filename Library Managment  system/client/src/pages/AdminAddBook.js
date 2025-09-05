import React, { useState } from "react";
import { addBook } from "../api/api";

export default function AdminAddBook() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const payload = { 
        title: form.title,
        author: form.author,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity)
      };
      await addBook(payload);
      setMessage("Book added successfully");
      setForm({ title: "", author: "", description: "", price: "", quantity: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Add book failed");
    }
  };

  return (
    <div className="page form-page">
      <h2>Add Book (Admin)</h2>
      <form onSubmit={submit} className="form">
        <label>Title</label>
        <input value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} required />
        <label>Author</label>
        <input value={form.author} onChange={(e)=>setForm({...form, author:e.target.value})} required />
        <label>Description</label>
        <textarea value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} required />
        <label>Price</label>
        <input value={form.price} onChange={(e)=>setForm({...form, price:e.target.value})} required />
        <label>Quantity</label>
        <input value={form.quantity} onChange={(e)=>setForm({...form, quantity:e.target.value})} required />
        <button className="btn" type="submit">Add Book</button>
        {message && <p className="info">{message}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
