const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const dbPath = path.join(__dirname, "Database/bookings.db");
const db = new sqlite3.Database(dbPath);

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  mobile TEXT,
  address TEXT,
  guests INTEGER,
  rooms INTEGER,
  arrival TEXT,
  departure TEXT,
  dietary TEXT,
  comment TEXT
)`);

app.post("/submit-booking", (req, res) => {
  console.log("---- New Booking Request ----");
  console.log("Raw body:", req.body);

  const {
    name, email, mobile, address,
    guests, rooms, arrival, departure,
    dietary, comment
  } = req.body;

  // Log each field to check for undefined or missing values
  console.log("Parsed fields:");
  console.log("name:", name);
  console.log("email:", email);
  console.log("mobile:", mobile);
  console.log("address:", address);
  console.log("guests:", guests);
  console.log("rooms:", rooms);
  console.log("arrival:", arrival);
  console.log("departure:", departure);
  console.log("dietary:", dietary);
  console.log("comment:", comment);

  db.run(
    `INSERT INTO bookings (name, email, mobile, address, guests, rooms, arrival, departure, dietary, comment)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, email, mobile, address, guests, rooms, arrival, departure, dietary, comment],
    function (err) {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Booking failed." });
      }
      console.log("Booking inserted!"); // Debug log
      res.json({ message: "Booking successful!" });
    }
  );
});

app.put("/edit-booking/:id", (req, res) => {
  const bookingId = req.params.id;
  const {
    name, email, mobile, address,
    guests, rooms, arrival, departure,
    dietary, comment
  } = req.body;

  db.run(
    `UPDATE bookings SET
      name = ?, email = ?, mobile = ?, address = ?, guests = ?, rooms = ?,
      arrival = ?, departure = ?, dietary = ?, comment = ?
     WHERE id = ?`,
    [name, email, mobile, address, guests, rooms, arrival, departure, dietary, comment, bookingId],
    function (err) {
      if (err) {
        console.error("DB Error:", err);
        return res.status(500).json({ message: "Update failed." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Booking not found." });
      }
      res.json({ message: "Booking updated!" });
    }
  );
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Internal server error." });
});

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});