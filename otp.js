const express = require("express");
const router = express.Router();
const db = require("../db/database");
const nodemailer = require("nodemailer");

// SEND OTP
router.post("/send", (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).send("Login required");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  db.run(
    "INSERT INTO otp (user_id,code,expires_at) VALUES (?,?,?)",
    [user.id, code, expires],
    err => {
      if (err) return res.send("Failed to generate OTP");

      // Send email via Gmail (make sure transporter is configured in server)
      res.send("OTP sent: " + code);
    }
  );
});

// VERIFY OTP
router.post("/verify", (req, res) => {
  const user = req.session.user;
  const { code } = req.body;
  if (!user) return res.status(401).send("Login required");

  db.get(
    "SELECT * FROM otp WHERE user_id=? AND code=? AND expires_at>datetime('now')",
    [user.id, code],
    (err, row) => {
      if (!row) return res.send("Invalid or expired OTP");
      res.send("OTP verified");
    }
  );
});

module.exports = router;
