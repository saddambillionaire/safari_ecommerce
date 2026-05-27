import express from "express";
import path from "path";
import { ENV } from "./config/env.js";

const app = express();

const __dirname = path.resolve();

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

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});