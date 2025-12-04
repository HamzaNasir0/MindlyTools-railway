import { useState } from "react";
import { auth } from "../firebase";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export default function ChooseUsername({ onComplete }) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const saveUsername = async () => {
    setError("");
    setLoading(true);

    if (!username.trim()) {
      setError("Username cannot be empty");
      setLoading(false);
      return;
    }

    try {
      // NOTE: We still get the ID token here as the session cookie may not be
      // verified/established yet after the initial /google call
      const token = await auth.currentUser.getIdToken();

      const res = await fetch(`${BACKEND_URL}/api/auth/set-username`, {
        // 👈 UPDATED URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include", // 👈 Send the cookie
        body: JSON.stringify({ username }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        onComplete();
      }
    } catch (err) {
      setError("Something went wrong, try again");
    }

    setLoading(false);
  };

  return (
    <div className="choose-username-container">
      <div className="choose-username-box">
        <h2>Create a Username</h2>
        <p>Choose a unique username to complete your account</p>

        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
          placeholder="Enter username"
        />

        {error && <div className="error">{error}</div>}

        <button onClick={saveUsername} disabled={loading}>
          {loading ? "Saving..." : "Save and Continue"}
        </button>
      </div>
    </div>
  );
}
