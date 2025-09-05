// controllers/borrowController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModels.js";
import { User } from "../models/usermodels.js";
import { calculateFine } from "../utils/fineCalculator.js";

export const recordBorrowedBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { email } = req.body;

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email, accountverified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }
  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available", 400));
  }

  // user.borrowedbooks (schema uses borrowedbooks)
  const isAlreadyBorrowed = (user.borrowedbooks || []).find(
    (b) => b.bookid && b.bookid.toString() === id && b.returned === false
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed", 400));
  }
  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrowEntry = {
    bookid: book._id,
    booktitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    returned: false,
  };

  user.borrowedbooks = user.borrowedbooks || [];
  user.borrowedbooks.push(borrowEntry);
  await user.save();

  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    price: book.price,
  });
  res.status(200).json({
    success: true,
    message: "Borrowed book recorded successfully",
  });
});

export const returnBorrowBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { email } = req.body;
  const book = await Book.findById(bookId);

  if (!book) {
    return next(new ErrorHandler("Book not found", 404));
  }

  const user = await User.findOne({ email, accountverified: true });
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const borrowedBookEntry = (user.borrowedbooks || []).find(
    (b) => b.bookid && b.bookid.toString() === bookId && b.returned === false
  );

  if (!borrowedBookEntry) {
    return next(new ErrorHandler("You have not borrowed this book", 400));
  }

  borrowedBookEntry.returned = true;
  await user.save();

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  const borrow = await Borrow.findOne({
    book: bookId,
    "user.email": email,
    returnDate: null,
  });

  if (!borrow) {
    return next(new ErrorHandler("You have not borrowed this book", 400));
  }

  borrow.returnDate = new Date();

  const fine = calculateFine(borrow.dueDate);
  borrow.fine = fine;

  await borrow.save();
  res.status(200).json({
    success: true,
    message: fine !== 0 ? `The book has been returned successfully. The total charges, including a fine, are $${(fine + book.price).toFixed(2)}` : `The book has been returned successfully. The total charge is $${book.price.toFixed(2)}`,
  });
});

export const borrowedBooks = catchAsyncErrors(async (req, res, next) => {
  const borrowedbooks = req.user.borrowedbooks || [];
  res.status(200).json({
    success: true,
    borrowedbooks,
  });
});

export const getBorroedBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const borrowedBooks = await Borrow.find();
  res.status(200).json({
    success: true,
    borrowedBooks,
  });
});
