import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import routes from "./routes/index.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MindlyTools API is running...");
});

// API routes
app.use("/api", routes);

export default app;
