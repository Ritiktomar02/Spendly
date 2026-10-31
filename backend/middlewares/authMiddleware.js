import jwt from "jsonwebtoken";

// This middleware checks every protected route for a valid JWT
function protect(req, res, next) {
  // JWT is sent in the Authorization header as "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authorized — no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the user id to the request so controllers can use it
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized — invalid or expired token" });
  }
}

export default protect;

