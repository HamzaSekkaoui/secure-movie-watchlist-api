import express from "express";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findByUsername } from "./utils/db.js";
import watchlistRoutes from "./routes/watchlist.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Family Movie Watchlist API");
});


app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  // Test 9 : Utilisateur inexistant -> 401
  const user = findByUsername(username);
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  let isMatch = false;
  if (user.passwordHash) {
    try {
      isMatch = await bcrypt.compare(password, user.passwordHash);
    } catch (e) {
      isMatch = false;
    }
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

app.use("/api/watchlist", watchlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}...`);
});