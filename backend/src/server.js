import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import connectDB from "./config/db.js";
import { serve } from "inngest/express";
import { inngestClient, functions } from "./config/inngest.js";

const app = express();

const __dirname = path.resolve();
app.use(express.json());
app.use(clerkMiddleware()); // Use Clerk middleware for authentication, it adds auth under the request object, req.auth, which contains the user's authentication information.
app.use(
  "/api/inngest",
  serve({
    client: inngestClient,
    functions
  })
);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running! finally i got it" });
});

// make the app ready for deploment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin" ,"dist", "index.html"));
  });
}

const startServer = async () => {
app.listen(ENV.PORT, () => {
  connectDB();
  console.log(`Server is running on port ${ENV.PORT}`);
});}
startServer();