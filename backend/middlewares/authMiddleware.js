import jwt from "jsonwebtoken";

const notAuthorizedMessage = "Not authorized. Please sign in.";

// Checks the "Authorization: Bearer <token>" header and sets req.userId
export function requireAuth(req, res, next) {
  if (!process.env.JWT_SECRET) {
    console.error("Auth check failed: JWT_SECRET is not set in .env");
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }

  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: notAuthorizedMessage });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;
    return next();
  } catch {
    // Invalid, expired or tampered token
    return res.status(401).json({ message: notAuthorizedMessage });
  }
}
