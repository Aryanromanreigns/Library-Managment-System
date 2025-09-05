// controllers/authController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/usermodels.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmails.js";
import { generateForgotPasswordEmailTemplate } from "../utils/emailTemplates.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  let { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all the fields", 400));
  }

  email = email.trim().toLowerCase();

  const isRegistered = await User.findOne({ email, accountverified: true });
  if (isRegistered) {
    return next(new ErrorHandler("User already exists", 400));
  }

  const registrationAttemptsByUser = await User.find({ email, accountverified: false });
  if (registrationAttemptsByUser.length >= 5) {
    return next(new ErrorHandler(
      "You have exceeded the number of registrations. Please try again later",
      400
    ));
  }

  if (password.length < 8 || password.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
  }

  // Hash password & create user
  const hashedPassword = await bcrypt.hash(String(password), 10);
  const user = new User({
    name,
    email,
    password: hashedPassword,
  });

  // Generate verification code + expiry
  const verificationCode = user.generateVerificationCode();  // sets user.verificationCode & expiry
  user.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 10 min expiry

  // Save user to DB
  await user.save();
  console.log("✅ User saved in DB:", user.email, "OTP:", verificationCode);

  // Send verification email
  try {
    await sendVerificationCode(verificationCode, email);
    console.log("✅ Verification email sent:", email);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return next(new ErrorHandler("Failed to send verification code", 500));
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully. Please verify your email.",
  });
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  let { email, otp } = req.body;
  if (!email || !otp) return next(new ErrorHandler("Email or OTP is missing", 400));

  email = email.trim().toLowerCase();

  const user = await User.findOne({ email, accountverified: false }).sort({ createdAt: -1 });

  if (!user) return next(new ErrorHandler("User not found or already verified", 404));

  if (String(user.verificationCode) !== String(otp)) return next(new ErrorHandler("Invalid OTP", 400));

  if (Date.now() > new Date(user.verificationCodeExpire).getTime()) return next(new ErrorHandler("OTP expired", 400));

  user.accountverified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpire = undefined;
  await user.save({ validateModifiedOnly: true });

  sendToken(user, 200, "Account verified successfully", res);
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }
  const user = await User.findOne({ email, accountverified: true }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }
  sendToken(user, 200, "User logged in successfully", res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // corrected: use req.body
  if (!req.body.email) {
    return next(new ErrorHandler("Email is required", 400));
  }
  const email = req.body.email.trim().toLowerCase();
  const user = await User.findOne({
    email,
    accountverified: true,
  });
  if (!user) {
    return next(new ErrorHandler("Invalid email", 400));
  }
  const resetToken = user.getResetPasswordToken();

  await user.save({
    validateBeforeSave: false
  });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);

  try {
    await sendEmail({ email: user.email, subject: "Bookworm Library management system password recovery", message });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    // rollback tokens stored in DB
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const reseatPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password and confirm password do not match", 400));
  }

  if (req.body.password.length < 8 || req.body.password.length > 16 || req.body.confirmPassword.length < 8 || req.body.confirmPassword.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, "Password reset successfully", res);
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }
  const isPasswordMatched = await bcrypt.compare(currentPassword, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Current password is incorrect", 400));
  }
  if (newPassword.length < 8 || newPassword.length > 16 || confirmNewPassword.length < 8 || confirmNewPassword.length > 16) {
    return next(new ErrorHandler("Password must be between 8 and 16 characters", 400));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New password and confirm new password do not match", 400));
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  res.status(200).json({
    success: true,
    message: "Password updated",
  });
});
