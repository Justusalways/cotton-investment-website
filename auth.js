const express = require("express");
const router = express.Router();
const db = require("../db/database");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.send("Email & password required");

  const hashed = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email,password,created_at) VALUES (?,?,datetime('now'))",
    [email, hashed],
    err => {
      if (err) return res.send("User exists or DB error");
      res.send("Registered successfully");
    }
  );
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.send("Email & password required");

  db.get("SELECT * FROM users WHERE email=?", [email], async (err, row) => {
    if (!row) return res.send("User not found");
    const match = await bcrypt.compare(password, row.password);
    if (!match) return res.send("Wrong password");

    req.session.user = row;
    res.send("Logged in");
  });
});

module.exports = router;
