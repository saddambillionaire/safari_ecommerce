import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { ENV } from "./config/env.js";
import connectDB from "./config/db.js";
import { serve } from "inngest/express";
import { inngestClient, functions } from "./config/inngest.js";
import adminRoutes from "./routes/admin.route.js";
// import userRoutes from "./routes/user.route.js";

const app = express();

const __dirname = path.resolve();
app.use(express.json());


app.use(
  "/api/inngest",
  serve({
    client: inngestClient,
    functions
  })
);
app.use("/api/admin", adminRoutes);
// app.use("/api/users", userRoutes);

app.use(clerkMiddleware()); // Use Clerk middleware for authentication, it adds auth under the request object, req.auth, which contains the user's authentication information.
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
  try {
    await connectDB();

    app.listen(ENV.PORT, () => {
      console.log(`Server is running on port ${ENV.PORT}`);
    });

  } catch (error) {
    console.log("Database connection failed:", error);
  }
};

startServer();