import express from "express";
import admin from "../config/firebase.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
const db = admin.database();

const SESSION_COOKIE_NAME = "__session"; 

/**
 * POST /api/auth/google
 * Verifies Firebase token, stores/loads user profile, and SETS SESSION COOKIE.
 */
router.post("/google", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "Missing ID token for session creation" });
    }

    const idToken = header.split(" ")[1];
    
    // 1. Verify the ID Token from the client
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const userRef = db.ref(`users/${uid}`);
    const snapshot = await userRef.once("value");
    let user = snapshot.val();

    // 2. User Setup (Existing Logic)
    if (!user) {
      const newUser = {
        email: decodedToken.email,
        name: decodedToken.name || decodedToken.displayName || null,
        picture: decodedToken.picture || decodedToken.photoURL || null,
        username: null,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
      await userRef.set(newUser);
      user = newUser;
    }

    // 5 days expiration (adjust as needed, max is 2 weeks)
    const FIVE_DAYS = 60 * 60 * 24 * 5 * 1000; 
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn: FIVE_DAYS });

    const cookieOptions = { 
      maxAge: FIVE_DAYS, 
      httpOnly: true, // Prevents client-side script access (XSS prevention)
      // Use secure:true only on HTTPS (i.e., production/Railway)
      secure: process.env.NODE_ENV === 'production', 
      sameSite: 'Lax', 
    };

    res.cookie(SESSION_COOKIE_NAME, sessionCookie, cookieOptions);
    
    // 4. RETURN RESPONSE
    if (!user.username) {
      return res.json({ needsUsername: true });
    }
    
    return res.json({
      success: true,
      user: { uid, ...user }
    });

  } catch (err) {
    console.error("AUTH/GOOGLE ERROR:", err);
    // Clear cookie on auth failure to ensure a clean state
    res.clearCookie(SESSION_COOKIE_NAME); 
    res.status(401).json({ error: "Auth failed or token expired/invalid" });
  }
});


/**
 * POST /api/auth/set-username
 * Saves username securely (Uses updated verifyToken middleware)
 */
router.post("/set-username", verifyToken, async (req, res) => {
  try {
    const uid = req.uid; // Retrieved from the verifyToken middleware
    const { username } = req.body;
    
    if (!username) return res.status(400).json({ error: "Missing username" });

    // Check uniqueness via lookup
    const existing = await db.ref(`usernames/${username}`).once("value");
    if (existing.exists()) {
      return res.status(400).json({ error: "Username already taken" });
    }

    // Save user’s username and reverse lookup
    await db.ref(`users/${uid}/username`).set(username);
    await db.ref(`usernames/${username}`).set(uid);

    res.json({ success: true, username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to set username" });
  }
});


/**
 * POST /api/auth/signout
 * Clears the session cookie and revokes the session on Firebase.
 */
router.post("/signout", async (req, res) => {
    const sessionCookie = req.cookies[SESSION_COOKIE_NAME];
    
    // 1. Clear cookie locally
    res.clearCookie(SESSION_COOKIE_NAME);

    // 2. Revoke session on the Firebase server for security
    if (sessionCookie) {
        try {
            const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie);
            // Revoke all refresh tokens for the user identified by 'sub' (uid)
            await admin.auth().revokeRefreshTokens(decodedClaims.sub); 
        } catch (error) {
            console.warn("Could not revoke Firebase session tokens (already expired/invalid):", error.message);
        }
    }

    res.json({ success: true, message: "Signed out successfully" });
});


export default router;