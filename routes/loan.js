const express = require("express");
const router = express.Router();
const db = require("../db/database");

// REQUEST LOAN
router.post("/", (req, res) => {
  const user = req.session.user;
  const { amount } = req.body;

  if (!user) return res.status(401).send("Login required");
  if (!amount || amount <= 0) return res.send("Invalid amount");

  db.run(
    "INSERT INTO transactions (user_id,type,amount,status,created_at) VALUES (?,?,?,?,datetime('now'))",
    [user.id, "Loan", amount, "Pending"],
    err => {
      if (err) return res.send("Loan request failed");
      res.send("Loan request submitted for approval");
    }
  );
});

module.exports = router;
