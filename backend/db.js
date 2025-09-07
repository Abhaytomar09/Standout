const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const db = new sqlite3.Database(path.join(__dirname, "twitter.db"));

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, email TEXT UNIQUE, password TEXT, name TEXT, lastNameChange INTEGER, strikes INTEGER DEFAULT 0, blockedUntil INTEGER DEFAULT 0)");
  db.run("CREATE TABLE IF NOT EXISTS tweets (id INTEGER PRIMARY KEY, userId INTEGER, content TEXT, media TEXT, mediaType TEXT, createdAt DATETIME DEFAULT CURRENT_TIMESTAMP, likes INTEGER DEFAULT 0)");
  db.run("CREATE TABLE IF NOT EXISTS tweet_likes (id INTEGER PRIMARY KEY, tweetId INTEGER, userId INTEGER, UNIQUE(tweetId, userId))");
  db.all("PRAGMA table_info(tweets)", (err, columns) => {
    if (columns && !columns.some(col => col.name === 'likes')) {
      db.run("ALTER TABLE tweets ADD COLUMN likes INTEGER DEFAULT 0");
    }
  });
});

module.exports = db;
