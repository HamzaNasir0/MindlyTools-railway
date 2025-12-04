import express from "express";
import admin from "firebase-admin";
import multer from "multer";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/update-username", verifyToken, async (req, res) => {
  const { username } = req.body;

  if (!username)
    return res.status(400).json({ error: "Username cannot be empty" });

  await admin.database().ref(`users/${req.uid}/username`).set(username);

  res.json({ success: true });
});

router.post("/update-picture", verifyToken, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  const base64 = `data:image/jpeg;base64,${req.file.buffer.toString("base64")}`;

  await admin.database().ref(`users/${req.uid}/picture`).set(base64);

  res.json({ success: true });
});

export default router;
