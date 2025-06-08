const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json()); // to parse JSON body

// Send homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// Handle booking form submission
app.post("/submit-booking", (req, res) => {
  const {
    name, email, mobile, address, guests,
    rooms, arrival, departure, dietary, comment
  } = req.body;

  const dbPath = path.resolve(__dirname, "database/bookings.db");
  const db = new sqlite3.Database(dbPath);

  const sql = `
    INSERT INTO bookings (name, email, mobile, address, guests, rooms, arrival, departure, dietary, comment)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    name, email, mobile, address, guests,
    rooms, arrival, departure, dietary, comment
  ], function (err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: "Failed to submit booking" });
    } else {
      res.status(200).json({ message: "Booking submitted successfully!" });
    }
  });

  db.close();
});


// Admin route to fetch all bookings
app.get("/admin/bookings", (req, res) => {
  const dbPath = path.resolve(__dirname, "database/bookings.db");
  const db = new sqlite3.Database(dbPath);

  const sql = `SELECT * FROM bookings`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: "Failed to retrieve bookings" });
    } else {
      res.json(rows);
    }
  });

  db.close();
});



app.listen(8000, () =>
  console.log("Server is running on http://localhost:8000/")
);
