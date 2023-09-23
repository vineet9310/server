const express = require("express");
const router = express.Router();
const pool = require("../logindb");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");

// Registration route
router.post("/register", async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_name = $1", [username]);
    if (user.rows.length > 0) {
      return res.status(401).json({ message: "User already exists!" });
    }

    // Insert the new user into the database with the plain password
    const newUser = await pool.query(
      "INSERT INTO users (user_name, user_password, user_role) VALUES ($1, $2, $3) RETURNING *",
      [username, password, role]
    );

    // Generate a JWT token
    const jwtToken = jwtGenerator(newUser.rows[0].user_id);

    return res.json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_name = $1", [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if incoming password is the same as the database password
    if (password === user.rows[0].user_password) {
      // Password is correct, generate a JWT token
      const jwtToken = jwtGenerator(user.rows[0].user_id);
      return res.json({ jwtToken, role: user.rows[0].user_role });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Verify token route
router.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
