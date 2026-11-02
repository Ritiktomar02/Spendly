import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const duplicateEmailMessage = "An account with this email already exists";

// POST /api/auth/register
export async function registerUser(req, res) {
  const { name, email, password } = req.body || {};

  // Only accept plain strings (also blocks query objects like { "$ne": null })
  if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    return res.status(400).json({ message: "Name is required" });
  }
  if (!emailPattern.test(normalizedEmail)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters" });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({ message: duplicateEmailMessage });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name: trimmedName, email: normalizedEmail, passwordHash });

    return res.status(201).json({
      message: "Account created successfully",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    // Two requests with the same email can race past the check above
    if (error.code === 11000) {
      return res.status(409).json({ message: duplicateEmailMessage });
    }
    console.error("Registration failed:", error.message);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}

// POST /api/auth/login
export async function loginUser(req, res) {
  const { email, password } = req.body || {};

  // Only accept plain, non-empty strings (also blocks query objects like { "$ne": null })
  if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("Login failed: JWT_SECRET is not set in .env");
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }

  const normalizedEmail = email.trim().toLowerCase();

  try {
    const user = await User.findOne({ email: normalizedEmail });
    const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));

    // Same message for unknown email and wrong password, so emails aren't revealed
    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({
      message: "Logged in successfully",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}
