import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { auth } from "./firebase";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChooseUsername from "./pages/ChooseUsername";
import HabitStats from "./pages/HabitStats";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [needsUsername, setNeedsUsername] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      // User logged out
      if (!user) {
        setBackendUser(null);
        setNeedsUsername(false);
        setLoading(false);
        return;
      }

      try {
        const token = await user.getIdToken();

        const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        // If server returns HTML or error, prevent JSON crash
        const text = await res.text();
        let data;

        try {
          data = JSON.parse(text);
        } catch {
          console.error("Server did not return JSON:", text);
          setLoading(false);
          return;
        }

        if (data.needsUsername) {
          setNeedsUsername(true);
        } else {
          setBackendUser(data.user);
          setNeedsUsername(false);
        }
      } catch (err) {
        console.error("AUTH ERROR:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div style={{ color: "white" }}>Loading...</div>;

  if (!firebaseUser) return <Login />;

  if (needsUsername) {
    return <ChooseUsername onComplete={() => window.location.reload()} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home user={backendUser} />} />
        <Route
          path="/stats/:id/:range"
          element={<HabitStats user={backendUser} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
