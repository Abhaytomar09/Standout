const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../../public/uploads"));
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fname = Date.now() + "_" + Math.round(Math.random()*1e6) + ext;
    cb(null, fname);
  }
});

const upload = multer({ storage });

router.post("/media", upload.single("media"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ url: "/uploads/" + req.file.filename, type: req.file.mimetype });
});

module.exports = router;
