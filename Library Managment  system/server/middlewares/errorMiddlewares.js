// middlewares/errorMiddlewares.js
class ErrorHandler extends Error {
  constructor(message, statuscode) {
    super(message);
    this.statuscode = statuscode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statuscode = err.statuscode || 500;

  console.error("🔥 ERROR CAUGHT IN MIDDLEWARE 🔥");
  console.error("Status Code:", err.statuscode);
  console.error("Message:", err.message);
  console.error("Stack:", err.stack);

  if (err.code === 11000) {
    const statuscode = 400;
    const message = `Duplicate field value entered`;
    err = new ErrorHandler(message, statuscode);
  }

  if (err.name === "JsonWebTokenError") {
    const statuscode = 400;
    const message = `Json web token is invalid. Try again.`;
    err = new ErrorHandler(message, statuscode);
  }

  if (err.name === "TokenExpiredError") {
    const statuscode = 400;
    const message = `Json web token expired. Try again.`;
    err = new ErrorHandler(message, statuscode);
  }

  if (err.name === "CastError") {
    const statuscode = 400;
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, statuscode);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors).map(error => error.message).join(" ")
    : err.message;

  return res.status(err.statuscode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
