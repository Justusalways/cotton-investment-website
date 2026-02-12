const express = require("express");
const router = express.Router();
const db = require("../db/database");

router.get("/", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  db.get(
    "SELECT id, fullname, balance, profit, loan, kyc_status FROM users WHERE id=?",
    [req.session.user.id],
    (err, user) => {

      if (err || !user) {
        return res.send("User not found");
      }

      db.all(
        "SELECT date, type, amount, status FROM transactions WHERE user_id=? ORDER BY date DESC LIMIT 5",
        [user.id],
        (err, transactions) => {

          res.render("dashboard", {
            user: user,
            transactions: transactions || []
          });

        }
      );
    }
  );
});

module.exports = router;
