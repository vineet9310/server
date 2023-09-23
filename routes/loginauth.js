const express = require("express");
const router = express.Router();
const pool = require("../logindb");
const jwtGenerator = require("../utils/jwtGenerator");
const authorize = require("../middleware/authorize");

// Login route
router.post("/login", async (req, res) => {
  try {
    // Destructure the req.body (username, password)
    const { username, password } = req.body;

    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE user_name = $1", [username]);

    if (user.rows.length === 0) {
      // User doesn't exist
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Check if incoming password is the same as the database password
    if (password === user.rows[0].user_password) {
      // Password is correct, generate a JWT token
      const jwtToken = jwtGenerator(user.rows[0].user_id);
      return res.json({ jwtToken });
    } else {
      // Password is incorrect
      return res.status(401).json({ message: "Invalid Credentials" });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Get all users route
router.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Fetch assigned projects for the logged-in user
router.get('/assigned-projects/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const query = `
      SELECT users.user_name, projects_assigned.project_name, projects_assigned.assigned_date
      FROM users
      INNER JOIN projects_assigned ON users.user_id = projects_assigned.user_id
      WHERE users.user_id = $1;
    `;

    const assignedProjects = await pool.query(query, [userId]);
    res.json(assignedProjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get("/user-access-project", authorize, async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT user_id FROM projects_assigned WHERE user_id = $1",
      [req.user.id] 
    ); 
        
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


router.get("/verify", authorize, (req, res) => {
  try {
    res.json(true);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
