// services/removeUnverifiedAccount.js
import cron from "node-cron";
import { User } from "../models/usermodels.js";

export const removeUnverifiedAccount = () => {
  cron.schedule("*/5 * * * *", async () => {
    const thirtyMinutes = new Date(Date.now() - 30 * 60 * 1000);
    try {
      await User.deleteMany({
        accountverified: false,
        createdAt: { $lt: thirtyMinutes },
      });
    } catch (err) {
      console.error("Error removing unverified accounts:", err);
    }
  });
};
