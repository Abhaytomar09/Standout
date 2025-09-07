const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const router = express.Router();

// Edit profile name (once every 48 hours)
router.post("/edit-profile", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  const { name } = req.body;
  if (!name || typeof name !== "string" || !name.trim()) return res.status(400).json({ error: "Name required" });
  db.get("SELECT name, lastNameChange FROM users WHERE id = ?", [req.session.userId], (err, user) => {
    if (err || !user) return res.status(400).json({ error: "User not found" });
    const now = Date.now();
    const lastChange = user.lastNameChange || 0;
    if (lastChange && now - lastChange < 48*60*60*1000) {
      const hoursLeft = Math.ceil((48*60*60*1000 - (now - lastChange))/3600000);
      return res.status(400).json({ error: `You can change your name again in ${hoursLeft} hours.` });
    }
    // Check if name is unique
    db.get("SELECT id FROM users WHERE name = ? AND id != ?", [name, req.session.userId], (err3, existing) => {
      if (existing) return res.status(400).json({ error: "Display name already taken." });
      db.run("UPDATE users SET name = ?, lastNameChange = ? WHERE id = ?", [name, now, req.session.userId], function(err2) {
        if (err2) return res.status(400).json({ error: "Update failed" });
        res.json({ success: true, name });
      });
    });
  });
});

router.post("/signup", (req, res) => {
  const { username, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);
  db.run("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hashed], function(err) {
    if (err) return res.status(400).json({ error: "User already exists" });
    req.session.userId = this.lastID;
    res.json({ id: this.lastID, username, email });
  });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) return res.status(400).json({ error: "No user" });
    if (!bcrypt.compareSync(password, user.password)) return res.status(400).json({ error: "Wrong password" });
    req.session.userId = user.id;
    res.json({ id: user.id, username: user.username, email: user.email });
  });
});

router.get("/me", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  db.get("SELECT id, username, email FROM users WHERE id = ?", [req.session.userId], (err, user) => {
    res.json(user);
  });
});

router.post("/logout", (req, res) => {
  req.session.destroy(() => res.json({ message: "Logged out" }));
});

module.exports = router;
