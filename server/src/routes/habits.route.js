import express from "express";
import admin from "firebase-admin";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const db = admin.database();

/**
 * GET all habits
 */
router.get("/", verifyToken, async (req, res) => {
  const ref = db.ref(`habits/${req.uid}`);
  const snapshot = await ref.once("value");
  res.json(snapshot.val() || {});
});

/**
 * ADD new habit
 */
router.post("/", verifyToken, async (req, res) => {
  const { name } = req.body;

  if (!name) return res.status(400).json({ error: "Habit name required" });

  const ref = db.ref(`habits/${req.uid}`);
  const newHabit = await ref.push({
    name,
    createdAt: Date.now(),
  });

  res.json({ id: newHabit.key, name });
});

/**
 * TOGGLE completion for a specific day
 */
router.post("/:habitId/toggle", verifyToken, async (req, res) => {
  const { date } = req.body;
  if (!date) return res.status(400).json({ error: "Missing date" });

  const ref = db.ref(`habit_logs/${req.uid}/${req.params.habitId}/${date}`);

  const snapshot = await ref.once("value");
  const exists = snapshot.val();

  if (exists) {
    await ref.remove();
    return res.json({ completed: false });
  } else {
    await ref.set(true);
    return res.json({ completed: true });
  }
});

/**
 * GET stats (week/month/year)
 */
router.get("/stats/:habitId/:range", verifyToken, async (req, res) => {
  const { habitId, range } = req.params;

  const logsRef = db.ref(`habit_logs/${req.uid}/${habitId}`);
  const snapshot = await logsRef.once("value");
  const logs = snapshot.val() || {};

  const now = new Date();
  let filtered = {};

  Object.entries(logs).forEach(([date, value]) => {
    const day = new Date(date);

    if (range === "week") {
      const diff = (now - day) / (1000 * 60 * 60 * 24);
      if (diff <= 7) filtered[date] = value;
    }

    if (range === "month") {
      if (day.getMonth() === now.getMonth()) filtered[date] = value;
    }

    if (range === "year") {
      if (day.getFullYear() === now.getFullYear()) filtered[date] = value;
    }
  });

  res.json(filtered);
});

/**
 * GET all logs for all habits (used for streak/history)
 */
router.get("/logs", verifyToken, async (req, res) => {
  const ref = db.ref(`habit_logs/${req.uid}`);
  const snapshot = await ref.once("value");
  res.json(snapshot.val() || {});
});

export default router;
