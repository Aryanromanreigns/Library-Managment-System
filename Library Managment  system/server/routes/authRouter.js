// routes/authRouter.js
import express from "express";
import { forgotPassword, getUser, login, logout, register, reseatPassword, updatePassword, verifyOTP } from "../controllers/authController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/me", isAuthenticated, getUser);
router.post("/password/forgot", forgotPassword);
router.put("/password/reset/:token", reseatPassword);
router.put("/password/update", isAuthenticated, updatePassword); // fixed route name

export default router;
