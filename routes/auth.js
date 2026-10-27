import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByUsername } from "../utils/db.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required" });
  }

  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  let isMatch = false;
  try {
    if (user.passwordHash) {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    }
  } catch (e) {
    isMatch = false;
  }

  if (!isMatch && user._password) {
    isMatch = (user._password === password);
  }

  if (!isMatch) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const secret = process.env.JWT_SECRET || "secret";
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    secret,
    { expiresIn: "1h" }
  );

  return res.status(200).json({ token });
});

export default router;