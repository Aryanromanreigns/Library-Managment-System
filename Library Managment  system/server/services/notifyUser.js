// services/notifyUser.js
import cron from "node-cron";
import { Borrow } from "../models/borrowModels.js";
import { sendEmail } from "../utils/sendEmails.js";
// import { User } from "../models/usermodels.js"; // not used but kept if needed later

export const notifyUser = () => {
  cron.schedule("*/30 * * * *", async () => {
    try {
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const borrowers = await Borrow.find({
        dueDate: { $lt: oneDayAgo },
        returnDate: null,
        notified: false,
      });

      for (const element of borrowers) {
        if (element.user && element.user.email) {
          await sendEmail({
            email: element.user.email,
            subject: "Book return reminder",
            message: `Hello ${element.user.name},\n\nThis is a reminder that the book you borrowed is overdue. Please return the book to the library as soon as possible.`,
          });
          element.notified = true;
          await element.save();
          console.log(`Email sent to ${element.user.email}`);
        }
      }
    } catch (error) {
      console.error("Some error occurred while notifying users", error);
    }
  });
};
