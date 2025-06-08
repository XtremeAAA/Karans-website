const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database/bookings.db");
const db = new sqlite3.Database(dbPath);

// Create the bookings table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      mobile TEXT,
      address TEXT,
      guests INTEGER,
      rooms INTEGER,
      arrival TEXT,
      departure TEXT,
      dietary TEXT,
      comment TEXT
    )
  `, (err) => {
    if (err) {
      console.error("Failed to create table:", err.message);
    } else {
      console.log("✅ 'bookings' table created successfully.");
    }
  });
});

db.close();
