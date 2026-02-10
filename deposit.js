const express = require("express");
const router = express.Router();
const db = require("../db/database");

// CREATE DEPOSIT REQUEST
router.post("/", (req, res) => {
  const user = req.session.user;
  const amount = Number(req.body.amount);

  if (!user) return res.status(401).send("Login required");
  if (!amount || amount <= 0) return res.send("Invalid amount");

  db.run(
    "INSERT INTO transactions (user_id,type,amount,status,created_at) VALUES (?,?,?,?,datetime('now'))",
    [user.id, "Deposit", amount, "Pending"],
    err => {
      if (err) return res.send("Deposit failed");
      res.send("Deposit pending admin approval");
    }
  );
});

module.exports = router;
