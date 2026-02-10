const express = require("express");
const router = express.Router();
const multer = require("multer");
const db = require("../db/database");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "_" + file.originalname)
});
const upload = multer({ storage });

// SUBMIT KYC
router.post("/submit", upload.fields([
  { name: "id_file", maxCount: 1 },
  { name: "video", maxCount: 1 }
]), (req, res) => {
  if (!req.session.user) return res.send("Login required");

  const idFile = req.files.id_file?.[0]?.filename;
  const videoFile = req.files.video?.[0]?.filename;

  if (!idFile || !videoFile) return res.send("ID and video required");

  db.run(
    "INSERT INTO kyc (user_id,id_file,video_file,status) VALUES (?,?,?,'pending')",
    [req.session.user.id, idFile, videoFile],
    err => {
      if (err) return res.send("KYC failed");
      res.send("KYC submitted, pending admin approval");
    }
  );
});

module.exports = router;
