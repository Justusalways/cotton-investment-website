const express = require("express");
const router = express.Router();
const db = require("../db/database");

// NORMAL WITHDRAW
router.post("/", (req, res) => {
  const user = req.session.user;
  const amount = Number(req.body.amount);

  if (!user) return res.status(401).send("Login required");
  if (!amount || amount <= 0) return res.send("Invalid amount");
  if (user.kyc_status !== "approved") return res.send("KYC required");

  db.run(
    "INSERT INTO transactions (user_id,type,amount,status,created_at) VALUES (?,?,?,?,datetime('now'))",
    [user.id, "Withdraw", amount, "Pending"],
    err => {
      if (err) return res.send("Withdraw failed");
      res.send("Withdrawal pending admin approval");
    }
  );
});

// CRYPTO WITHDRAW $200 DAILY LIMIT
router.post("/crypto", (req, res) => {
  const user = req.session.user;
  const amount = Number(req.body.amount);

  if (!user) return res.status(401).send("Login required");
  if (!amount || amount <= 0) return res.send("Invalid amount");

  db.get(
    `SELECT IFNULL(SUM(amount),0) as total FROM transactions
     WHERE user_id=? AND type='CryptoWithdraw' AND date(created_at)=date('now')`,
    [user.id],
    (err, row) => {
      if (err) return res.send("Error checking limit");
      if (row.total + amount > 200 && user.kyc_status !== "approved")
        return res.send("Daily $200 crypto limit reached");

      db.run(
        "INSERT INTO transactions (user_id,type,amount,status,created_at) VALUES (?,?,?,?,datetime('now'))",
        [user.id, "CryptoWithdraw", amount, "Pending"],
        err2 => {
          if (err2) return res.send("Crypto withdraw failed");
          res.send("Crypto withdrawal pending admin approval");
        }
      );
    }
  );
});

module.exports = router;
