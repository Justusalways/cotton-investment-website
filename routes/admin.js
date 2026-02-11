const express = require("express");
const router = express.Router();
const db = require("../db/database");

// VIEW USERS
router.get("/users", (req, res) => {
  db.all(
    "SELECT id,email,balance,kyc_status FROM users",
    (err, rows) => {
      if (err) return res.status(500).send("DB error");
      res.json(rows);
    }
  );
});

// APPROVE TRANSACTION
router.post("/approve", (req, res) => {
  const { transaction_id } = req.body;
  db.get("SELECT * FROM transactions WHERE id=?", [transaction_id], (err, row) => {
    if (!row) return res.send("Transaction not found");

    let sql = "";
    if (row.type === "Deposit") sql = "UPDATE users SET balance=balance+? WHERE id=?";
    else if (row.type === "Withdraw" || row.type === "CryptoWithdraw")
      sql = "UPDATE users SET balance=balance-? WHERE id=?";

    if (!sql) return res.send("Cannot approve this type");

    db.run(sql, [row.amount, row.user_id], err2 => {
      if (err2) return res.send("Approval failed");
      db.run(
        "UPDATE transactions SET status='Approved' WHERE id=?",
        [transaction_id],
        () => res.send("Transaction approved")
      );
    });
  });
});

module.exports = router;
