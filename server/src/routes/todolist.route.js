import express from "express";
import admin from "firebase-admin";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// GET all items
router.get("/", verifyToken, async (req, res) => {
  const ref = admin.database().ref(`todolist/${req.uid}`);
  const snapshot = await ref.once("value");
  res.json(snapshot.val() || {});
});

// ADD item
router.post("/", verifyToken, async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Missing text" });

  const ref = admin.database().ref(`todolist/${req.uid}`);
  const newItem = await ref.push({ text });

  res.json({ id: newItem.key, text });
});

// DELETE item
router.delete("/:id", verifyToken, async (req, res) => {
  const ref = admin.database().ref(`todolist/${req.uid}/${req.params.id}`);
  await ref.remove();
  res.json({ success: true });
});

export default router;
