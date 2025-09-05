// middlewares/authMiddleware.js
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./errorMiddlewares.js";
import jwt from "jsonwebtoken";
import { User } from "../models/usermodels.js";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies || {};
  if (!token) {
    return next(new ErrorHandler("User is not authenticated", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  // console.log(decoded);
  req.user = await User.findById(decoded.id).select("-password");
  next();
});

export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("User not found in request", 401));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ErrorHandler(`User with role ${req.user.role} not allowed to access this resource`, 403));
    }
    next();
  };
};
