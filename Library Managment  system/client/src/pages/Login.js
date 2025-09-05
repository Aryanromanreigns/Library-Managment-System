import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login({ email, password });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        navigate("/");
      } else {
        // backend may return token only; fetch profile after login in App
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="page form-page">
      <h2>Login</h2>
      <form onSubmit={submit} className="form">
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />

        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />

        <button className="btn" type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
