const express = require("express");
const router = express.Router();
const db = require("../db/database");

// GET USER TRANSACTIONS
router.get("/", (req, res) => {
  const user = req.session.user;
  if (!user) return res.status(401).send("Login required");

  db.all(
    "SELECT * FROM transactions WHERE user_id=? ORDER BY created_at DESC",
    [user.id],
    (err, rows) => {
      if (err) return res.status(500).send("DB error");
      res.json(rows);
    }
  );
});

module.exports = router;
