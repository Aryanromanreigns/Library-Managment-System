import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../api/api";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate("/login");
    } catch (err) {
      console.error("Logout error", err);
    }
  };

  return (
    <nav className="nav">
      <div className="nav-left">
        <Link to="/" className="brand">BookWorm</Link>
        <Link to="/books">Books</Link>
        <Link to="/borrowed">My Borrowed</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-user">Hi, {user.name}</span>
            {user.role === "Admin" && <Link to="/admin/add">Admin</Link>}
            <button className="btn-inline" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
