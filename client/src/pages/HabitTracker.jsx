import { useEffect, useState } from "react";
import { auth } from "../firebase";
import styles from "../styles/habits.module.css";

export default function HabitTracker({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [habits, setHabits] = useState({});
  const [logs, setLogs] = useState({});
  const [text, setText] = useState("");

  const loadHabits = async () => {
    const token = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5000/api/habits", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setHabits(data);
  };

  const loadLogs = async () => {
    const token = await auth.currentUser.getIdToken();
    const res = await fetch("http://localhost:5000/api/habits/logs", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setLogs(data || {});
  };

  const addHabit = async () => {
    if (!text.trim()) return;

    const token = await auth.currentUser.getIdToken();
    await fetch("http://localhost:5000/api/habits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: text }),
    });

    setText("");
    loadHabits();
  };

  const toggleHabit = async (id) => {
    const date = new Date().toISOString().split("T")[0];

    const token = await auth.currentUser.getIdToken();
    await fetch(`http://localhost:5000/api/habits/${id}/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ date }),
    });

    loadLogs();
  };

  const getStreak = (habitId) => {
    const habitLogs = logs[habitId] || {};
    let streak = 0;

    let day = new Date();
    for (let i = 0; i < 365; i++) {
      const dateStr = day.toISOString().split("T")[0];
      if (habitLogs[dateStr]) streak++;
      else break;
      day.setDate(day.getDate() - 1);
    }

    return streak;
  };

  const getHistory = (habitId) => {
    const habitLogs = logs[habitId] || {};
    let result = [];

    let day = new Date();
    for (let i = 6; i >= 0; i--) {
      let d = new Date();
      d.setDate(day.getDate() - i);
      let ds = d.toISOString().split("T")[0];
      result.push(habitLogs[ds] ? 1 : 0);
    }

    return result;
  };

  useEffect(() => {
    loadHabits();
    loadLogs();
  }, []);

  return (
    <div className={styles.habitContainer}>
      <div className={styles.habitContent}>
        <h1>Habit Tracker</h1>

        <div className={styles.habitInputRow}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="New habit..."
            className={styles.habitInput}
            onKeyPress={(e) => e.key === "Enter" && addHabit()}
          />
          <button className={styles.habitAddBtn} onClick={addHabit}>
            Add Habit
          </button>
        </div>

        <div className={styles.habitList}>
          {Object.entries(habits).map(([id, h]) => {
            const streak = getStreak(id);
            const history = getHistory(id);
            const today = new Date().toISOString().split("T")[0];
            const completedToday = logs[id]?.[today];

            return (
              <div key={id} className={styles.habitCard}>
                <div className={styles.habitCardHeader}>
                  <h3>{h.name}</h3>

                  <input
                    type="checkbox"
                    checked={!!completedToday}
                    onChange={() => toggleHabit(id)}
                  />
                </div>

                <div className={styles.habitStreak}>
                  🔥 Streak: <b>{streak}</b> days
                </div>

                <div className={styles.habitHistory}>
                  {history.map((day, idx) => (
                    <div
                      key={idx}
                      className={`${styles.historyDot} ${
                        day ? styles.on : styles.off
                      }`}
                      title={`Day ${idx + 1}: ${
                        day ? "Completed" : "Not completed"
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
