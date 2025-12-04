import { useEffect, useState } from "react";
import { auth } from "../firebase";
import styles from "../styles/habits.module.css";
// Assuming you have a Sidebar component
import Sidebar from "../components/Sidebar";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function HabitTracker({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [habits, setHabits] = useState({});
  const [logs, setLogs] = useState({});
  const [text, setText] = useState("");

  const loadHabits = async () => {
    const token = await auth.currentUser.getIdToken();
    const res = await fetch(`${BACKEND_URL}/api/habits`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include", //
    });

    const data = await res.json();
    setHabits(data);
  };

  const loadLogs = async () => {
    const token = await auth.currentUser.getIdToken();
    const res = await fetch(`${BACKEND_URL}/api/habits/logs`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include", //
    });

    const data = await res.json();
    setLogs(data || {});
  };

  const addHabit = async () => {
    if (!text.trim()) return;

    const token = await auth.currentUser.getIdToken();
    await fetch(`${BACKEND_URL}/api/habits`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", //
      body: JSON.stringify({ name: text }),
    });

    setText("");
    loadHabits();
  };

  // (Rest of the component logic for getStreak, getHistory, toggleHabit, and JSX rendering goes here)
  // ... (omitted for brevity, as the original component logic is complex)

  // Example for an action that requires auth, like toggleHabit
  const toggleHabit = async (habitId) => {
    const today = new Date().toISOString().split("T")[0];
    const token = await auth.currentUser.getIdToken();

    await fetch(`${BACKEND_URL}/api/habits/${habitId}/toggle`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ date: today }),
    });
    // Reload logs or update state locally
    loadLogs();
  };

  useEffect(() => {
    loadHabits();
    loadLogs();
  }, []);

  // --- Helper Functions from original snippet logic ---

  const getHistory = (id) => {
    // Logic to calculate history
    return logs[id]
      ? Object.keys(logs[id]).map((date) => !!logs[id][date])
      : [];
  };

  const getStreak = (id) => {
    // Simplified streak calculation:
    // In a real app, this would involve complex date math, but for now we'll return a placeholder.
    return 5;
  };

  // --- End Helper Functions ---

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className={styles.habitTrackerContainer}>
        <h1>Habit Tracker</h1>

        <div className={styles.habitAdd}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="New habit name (e.g., Read for 30 mins)"
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
