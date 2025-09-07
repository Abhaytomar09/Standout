const express = require("express");
const db = require("../db");
const router = express.Router();

const NUISANCE_WORDS = ["badword1", "badword2", "nuisance", "offensive"]; // Add more as needed
const BLOCK_DURATIONS = [20, 60, 900, 3600, 86400]; // seconds: 20s, 60s, 15m, 1h, 1d

function containsNuisance(content) {
  if (!content) return false;
  const lower = content.toLowerCase();
  return NUISANCE_WORDS.some(word => lower.includes(word));
}

router.get("/", (req, res) => {
  // Remove tweets older than 24h if setting is enabled (from frontend via query param)
  const remove24h = (req.query.remove24h === 'on');
  if (remove24h) {
    const cutoff = new Date(Date.now() - 24*60*60*1000).toISOString();
    db.run("DELETE FROM tweets WHERE createdAt < ?", [cutoff], () => {
      db.all("SELECT tweets.*, users.username FROM tweets JOIN users ON tweets.userId = users.id ORDER BY createdAt DESC", [], (err, rows) => {
        res.json(rows);
      });
    });
  } else {
    db.all("SELECT tweets.*, users.username FROM tweets JOIN users ON tweets.userId = users.id ORDER BY createdAt DESC", [], (err, rows) => {
      res.json(rows);
    });
  }
});

router.post("/", (req, res) => {
  if (!req.session.userId) {
  // ...existing code...
    return res.status(401).json({ error: "Not logged in" });
  }
  const { content, media, mediaType } = req.body;
  const hasText = content && typeof content === "string" && content.trim();
  const hasMedia = media && typeof media === "string" && media.trim();
  if (!hasText && !hasMedia) {
    console.error("Tweet missing text and media", req.body);
    return res.status(400).json({ error: "Tweet must have text or media." });
  }
  db.get("SELECT strikes, blockedUntil FROM users WHERE id = ?", [req.session.userId], (err, user) => {
    if (err) {
      console.error("DB error on user lookup:", err);
      return res.status(400).json({ error: "User not found (db error)" });
    }
    if (!user) {
  // ...existing code...
      return res.status(400).json({ error: "User not found" });
    }
    const now = Math.floor(Date.now() / 1000);
    if (user.blockedUntil && now < user.blockedUntil) {
      const wait = user.blockedUntil - now;
      return res.status(403).json({ error: `You are blocked for ${wait} more seconds due to policy violation.` });
    }
    if (containsNuisance(content)) {
      let strikes = (user.strikes || 0) + 1;
      let blockIdx = Math.min(strikes - 1, BLOCK_DURATIONS.length - 1);
      let blockedUntil = now + BLOCK_DURATIONS[blockIdx];
      db.run("UPDATE users SET strikes = ?, blockedUntil = ? WHERE id = ?", [strikes, blockedUntil, req.session.userId], () => {
        return res.status(403).json({ error: `Nuisance detected. You are blocked for ${BLOCK_DURATIONS[blockIdx]} seconds.` });
      });
    } else {
      db.run(
        "INSERT INTO tweets (userId, content, media, mediaType) VALUES (?, ?, ?, ?)",
        [req.session.userId, content || null, media || null, mediaType || null],
        function(err) {
          if (err) return res.status(400).json({ error: "Tweet failed" });
          res.json({ id: this.lastID, content, userId: req.session.userId, media, mediaType });
        }
      );
    }
  });
});

router.post("/:id/like", (req, res) => {
  if (!req.session.userId) return res.status(401).json({ error: "Not logged in" });
  const tweetId = req.params.id;
  const userId = req.session.userId;
  // Check if user already liked this tweet
  db.get("SELECT 1 FROM tweet_likes WHERE tweetId = ? AND userId = ?", [tweetId, userId], (err, row) => {
    if (row) return res.status(400).json({ error: "You have already liked this tweet." });
    // Add like
    db.run("INSERT INTO tweet_likes (tweetId, userId) VALUES (?, ?)", [tweetId, userId], function(err2) {
      if (err2) return res.status(400).json({ error: "Failed to like tweet." });
      db.run("UPDATE tweets SET likes = likes + 1 WHERE id = ?", [tweetId], function(err3) {
        if (err3) return res.status(400).json({ error: "Like failed" });
        res.json({ success: true });
      });
    });
  });
});

module.exports = router;
