import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; 

dotenv.config();

import routes from "./routes/index.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", 
    credentials: true, // 
  })
);
app.use(express.json());
app.use(cookieParser()); //

app.get("/", (req, res) => {
  res.send("MindlyTools API is running...");
});

// API routes
app.use("/api", routes);

export default app;