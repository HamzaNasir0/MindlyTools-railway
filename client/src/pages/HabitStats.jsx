import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { auth } from "../firebase";
import { useParams } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function HabitStats({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({});
  const { id, range } = useParams();

  const loadStats = async () => {
    const token = await auth.currentUser.getIdToken();
    const res = await fetch(`${BACKEND_URL}/api/habits/stats/${id}/${range}`, {
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include",
    });
    setStats(await res.json());
  };

  useEffect(() => {
    loadStats();
  }, [id, range]);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar
        user={user}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div style={{ flex: 1, padding: "40px", color: "white" }}>
        <h1>Habit Stats – {range}</h1>

        <p>Completed days: {Object.keys(stats).length}</p>

        <ul>
          {Object.keys(stats).map((date) => (
            <li key={date}>{date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
