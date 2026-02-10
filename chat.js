const express = require("express");
const db = require("../db/database");
const router = express.Router();

router.post("/", (req, res) => {
  db.run(
    `INSERT INTO chat (user_id,sender,message,created_at)
     VALUES (?,?,?,datetime('now'))`,
    [req.session.user.id, "user", req.body.message]
  );

  res.send("Support: We received your message.");
});

module.exports = router;
