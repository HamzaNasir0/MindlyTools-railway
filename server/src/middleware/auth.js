import admin from "firebase-admin";

export async function verifyToken(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({ error: "Missing token" });
    }

    const token = header.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    req.uid = decoded.uid; 

    next();
  } catch (err) {
    console.error("TOKEN ERROR:", err);
    res.status(401).json({ error: "Invalid token" });
  }
}
