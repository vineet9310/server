const express = require("express");
const router = express.Router();
const pool = require("../../logindb");
const jwtGenerator = require("../../utils/jwtGenerator");
const authorize = require("../../middleware/authorize");

// Assign a project to a user
router.post('/assign-project', async (req, res) => {
  try {
    const { userId, user_name, projectName } = req.body;

    // Insert into projects_assigned table
    await pool.query('INSERT INTO projects_assigned (user_id, user_name, project_name) VALUES ($1, $2, $3)', [userId, user_name, projectName]);

    res.json({ message: 'Project assigned successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch assigned projects for each user
router.get('/assigned-projects', async (req, res) => {
  try {
    const query = `
      SELECT pa.user_id, u.user_name, pa.project_name, pa.assigned_date
      FROM projects_assigned pa
      INNER JOIN users u ON pa.user_id = u.user_id;
    `;
    const assignedProjects = await pool.query(query);
    res.json(assignedProjects.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete an assigned project
router.delete('/assigned-projects/:userId/:projectName', async (req, res) => {
  try {
    const { userId, projectName } = req.params;
    await pool.query('DELETE FROM projects_assigned WHERE user_id = $1 AND project_name = $2', [userId, projectName]);
    res.json({ message: 'Assigned project deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Edit an assigned project
router.put('/assigned-projects/:userId/:projectName', async (req, res) => {
  try {
    const { userId, projectName } = req.params;
    const { newProjectName } = req.body;
    await pool.query('UPDATE projects_assigned SET project_name = $1 WHERE user_id = $2 AND project_name = $3', [newProjectName, userId, projectName]);
    res.json({ message: 'Assigned project updated successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
