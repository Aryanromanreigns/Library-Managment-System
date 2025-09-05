// routes/bookRouter.js
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { addBook, deleteBook, getAllBook } from "../controllers/bookController.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all", isAuthenticated, getAllBook);
router.delete("/delete/:id", isAuthenticated, isAuthorized("Admin"), deleteBook);

export default router;
