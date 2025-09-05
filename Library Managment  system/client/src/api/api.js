import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api/v1";

const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // important for cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export const getAllBooks = () => client.get("/book/all");
export const getBookById = (id) => client.get(`/book/book/${id}`).catch((err) => { throw err; });
// If your backend route for a single book differs, update the path above.

export const addBook = (payload) => client.post("/book/admin/add", payload);
export const deleteBook = (id) => client.delete(`/book/delete/${id}`);

export const borrowBook = (bookId, email) => client.post(`/borrow/record-borrow-book/${bookId}`, { email });
export const returnBook = (bookId, email) => client.put(`/borrow/return-borrowed-book/${bookId}`, { email });

export const getBorrowedByUser = () => client.get("/borrow/my-borrowed-books");
export const getAllBorrowed = () => client.get("/borrow/borrowed-books-by-users");

export const login = (data) => client.post("/auth/login", data);
export const register = (data) => client.post("/auth/register", data);
export const logout = () => client.get("/auth/logout");
export const getProfile = () => client.get("/auth/me");

export default client;
