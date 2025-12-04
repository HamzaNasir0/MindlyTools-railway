import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { auth } from "./firebase";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ChooseUsername from "./pages/ChooseUsername";

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

      const res = await fetch("http://localhost:5000/api/auth/google", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
