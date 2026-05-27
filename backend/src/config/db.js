import mongoose from "mongoose";
import {ENV} from "./env.js"

export const connectDB = async () => {
  try {
    const conn =   await mongoose.connect(ENV.DB_URL)            
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // exit code 1 indicates the failure and 0 indicates the success
  }
}
