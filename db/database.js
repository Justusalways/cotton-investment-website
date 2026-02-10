const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbFile = path.join(__dirname, "database.sqlite");
const db = new sqlite3.Database(dbFile, err => {
  if (err) console.error("DB error", err);
  else console.log("✅ SQLite connected");
});

db.serialize(() => {
  // === Create users table with all columns ===
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT UNIQUE,
      fullname TEXT,
      email TEXT UNIQUE,
      password TEXT,
      age INTEGER,
      source TEXT,
      balance REAL DEFAULT 0,
      profit_balance REAL DEFAULT 0,
      kyc_status TEXT DEFAULT 'not_verified',
      is_admin INTEGER DEFAULT 0,
      blocked INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // === Ensure is_admin, blocked, kyc_status exist (for old DBs) ===
  const columnsToCheck = [
    { name: "is_admin", defaultValue: 0 },
    { name: "blocked", defaultValue: 0 },
    { name: "kyc_status", defaultValue: "'not_verified'" },
  ];

  columnsToCheck.forEach(col => {
    db.run(`ALTER TABLE users ADD COLUMN ${col.name} DEFAULT ${col.defaultValue}`, err => {
      // Ignore error if column exists
    });
  });

  // === Create admin account safely ===
  db.run(
    `UPDATE users SET is_admin = 1 WHERE email = 'justusalways333@gmail.com'`,
    err => {
      if (err) console.log("⚠️ Admin account update skipped (may not exist yet)");
      else console.log("✅ Admin account set as admin");
    }
  );
});

module.exports = db;

