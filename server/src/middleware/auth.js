import admin from "firebase-admin";

const SESSION_COOKIE_NAME = "__session";

export async function verifyToken(req, res, next) {
  const sessionCookie = req.cookies?.[SESSION_COOKIE_NAME]; // Get cookie
  const authHeader = req.headers.authorization;
  
  let tokenToVerify = sessionCookie; // Prioritize cookie

  try {
    let decoded;

    if (sessionCookie) {
      // Verify session cookie (checkIfRevoked: true adds security)
      decoded = await admin.auth().verifySessionCookie(tokenToVerify, true);
    } else if (authHeader && authHeader.startsWith("Bearer ")) {
      // Fallback to ID Token
      tokenToVerify = authHeader.split(" ")[1];
      decoded = await admin.auth().verifyIdToken(tokenToVerify);
    } else {
      // No token or cookie found
      return res.status(401).json({ error: "Missing authentication token or session cookie" });
    }
    
    // Attach the user's UID to the request for route handlers
    req.uid = decoded.uid;
    
    return next();
    
  } catch (err) {
    console.error("AUTH VERIFICATION ERROR:", err.message);
    // Clear potentially stale/expired cookie on failure
    res.clearCookie(SESSION_COOKIE_NAME); 
    res.status(401).json({ error: "Session expired or invalid" });
  }
}