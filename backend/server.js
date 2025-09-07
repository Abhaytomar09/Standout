const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const tweetRoutes = require("./routes/tweets");
const uploadRoutes = require("./routes/upload");


const app = express();
app.use(cors({
  origin: "http://localhost:5000", // Change to your frontend origin if different
  credentials: true,
}));
app.use(bodyParser.json());
app.use(session({
  secret: "supersecret",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax', // Use 'none' if frontend is on a different origin and using https
    secure: false,   // Set to true if using https
  }
}));

app.use(express.static("public"));
app.use("/uploads", express.static("public/uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/tweets", tweetRoutes);
app.use("/api/upload", uploadRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
