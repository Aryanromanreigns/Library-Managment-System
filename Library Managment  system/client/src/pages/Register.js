import React, { useState } from "react";
import { register } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await register(form);
      setMessage(res.data?.message || "Registered. Verify your email if required.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="page form-page">
      <h2>Register</h2>
      <form onSubmit={submit} className="form">
        <label>Name</label>
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />

        <label>Email</label>
        <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" required />

        <label>Password</label>
        <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} type="password" required />

        <button className="btn" type="submit">Register</button>
        {error && <p className="error">{error}</p>}
        {message && <p className="info">{message}</p>}
      </form>
    </div>
  );
}
