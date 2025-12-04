import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { auth } from "./firebase";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChooseUsername from "./pages/ChooseUsername";
import HabitStats from "./pages/HabitStats";

// Get backend URL from environment variables
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [backendUser, setBackendUser] = useState(null);
  const [needsUsername, setNeedsUsername] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);

      if (!user) {
        setBackendUser(null);
        setNeedsUsername(false);
        setLoading(false);
        return;
      }

      const token = await user.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/auth/google`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await res.json();

      if (data.needsUsername) {
        setNeedsUsername(true);
      } else {
        setBackendUser(data.user);
        setNeedsUsername(false);
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
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
