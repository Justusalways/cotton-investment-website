const express = require("express");
const router = express.Router();
const db = require("../db/database");

// TEST ROUTE
router.get("/test", (req, res) => {
  res.send("Dashboard route working");
});

// GET USER BALANCE & KYC STATUS
router.get("/", (req, res) => {
  if (!req.session.user) return res.status(401).send("Login required");

  db.get(
    "SELECT balance, kyc_status FROM users WHERE id=?",
    [req.session.user.id],
    (err, row) => {
     res.json({
    user_id: user.user_id,
    balance: user.balance,
    profit: user.profit,
    kyc: user.kyc
  });
});
    }  
  );

module.exports = router;
