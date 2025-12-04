import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; // Don't forget to run 'npm install cookie-parser'

dotenv.config();

import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    // CRITICAL: Uses environment variable for dynamic origin
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true, // REQUIRED to allow cookies to be sent/received
    
  })
);
app.use(express.json());
app.use(cookieParser()); // Corrected line: no trailing non-comment text

app.get("/", (req, res) => {
  res.send("MindlyTools API is running...");
});

// API routes
app.use("/api", routes);

export default app;