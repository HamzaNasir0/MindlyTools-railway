import admin from "firebase-admin";

const SESSION_COOKIE_NAME = "__session";

export async function verifyToken(req, res, next) {
  const sessionCookie = req.cookies?.[SESSION_COOKIE_NAME]; 
  const authHeader = req.headers.authorization;
  
  try {
    let decoded;

    if (sessionCookie) {
      // 1. Check for Session Cookie (Persistent Auth)
      // Checks for revocation list on Firebase for security
      decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      // 2. Fallback to ID Token (Used only on first login/sign-up)
      const tokenToVerify = authHeader.split(" ")[1];
      decoded = await admin.auth().verifyIdToken(tokenToVerify);
    } else {
      // No token or cookie found
      return res.status(401).json({ error: "Missing authentication token or session cookie" });
    }
    
    req.uid = decoded.uid;
    
    return next();
    
  } catch (err) {
    console.error("AUTH VERIFICATION ERROR:", err.message);
    // Clear potentially stale/expired cookie on verification failure
    res.clearCookie(SESSION_COOKIE_NAME); 
    res.status(401).json({ error: "Session expired or invalid" });
  }
}