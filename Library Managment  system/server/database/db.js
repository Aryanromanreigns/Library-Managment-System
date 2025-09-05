import mongoose from "mongoose";

export const connectdb = () => {
  mongoose
    .connect(process.env.MONGO_URL, {
      dbName: "MERN_STACK_LIBRARY_MANAGMENT_SYSTEM"
    })
    .then(() => {
      console.log(`Database connected successfully`);
    })
    .catch(err => {
      console.log("Error connecting to database", err);
    });
};
