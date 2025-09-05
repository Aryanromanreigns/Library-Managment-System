// controllers/userControllers.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/usermodels.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
  // files are in req.files (using express-fileupload)
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Admin avatar is required", 400));
  }

  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please fill all fields", 400));
  }

  const isRegistered = await User.findOne({ email, accountverified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already registered", 400));
  }

  if (password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters long", 400));
  }

  const { avatar } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(avatar.mimetype)) {
    return next(new ErrorHandler("File format is not supported", 400));
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const cloudinaryResponse = await cloudinary.uploader.upload(
    avatar.tempFilePath, {
      folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS"
    }
  );
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error("cloudinary error :", cloudinaryResponse && cloudinaryResponse.error ? cloudinaryResponse.error : "Unknown cloudinary error");
    return next(new ErrorHandler("Failed to upload avatar image to cloudinary", 500));
  }
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: "Admin",
    accountverified: true,
    avatar: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    }
  });
  res.status(201).json({
    success: true,
    message: "Admin registered successfully",
    admin: user,
  });
});
