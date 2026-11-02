import bcrypt from "bcryptjs";
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
