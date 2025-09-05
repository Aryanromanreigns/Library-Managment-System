// routes/userRouters.js
import express from "express";
import { getAllUsers, registerNewAdmin } from "../controllers/userControllers.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/all", isAuthenticated, isAuthorized("Admin"), getAllUsers);
router.post("/add/new-admin", isAuthenticated, isAuthorized("Admin"), registerNewAdmin);

export default router;
