const express = require('express');
const router = express.Router();
const pool = require('../../Admindb'); // Import the PostgreSQL pool
const { exec } = require('child_process');
require('dotenv').config();

// Create a new project
router.post('/projects', async (req, res) => {
  const { project_name, customer, dd_project, pmo_office_coordinator, as_update_on_date } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO projects (project_name, customer, dd_project, pmo_office_coordinator, as_update_on_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, project_name',
      [project_name, customer, dd_project, pmo_office_coordinator, as_update_on_date]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Fetch all projects
router.get('/projects', (req, res) => {
  pool.query('SELECT project_name FROM projects', (error, result) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    } else {
      const projectNames = result.rows.map(row => row.project_name);
      res.json(projectNames);
    }
  });
});

// Update project by ID
router.put('/projects/:id', async (req, res) => {
  const projectId = req.params.id;
  const { project_name, customer, dd_project, pmo_office_coordinator, as_update_on_date } = req.body;
  try {
    const result = await pool.query(
      'UPDATE projects SET project_name = $1, customer = $2, dd_project = $3, pmo_office_coordinator = $4, as_update_on_date = $5 WHERE id = $6 RETURNING id, project_name',
      [project_name, customer, dd_project, pmo_office_coordinator, as_update_on_date, projectId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete project by ID
router.delete('/projects/:id', async (req, res) => {
  const projectId = req.params.id;
  try {
    const result = await pool.query('DELETE FROM projects WHERE id = $1 RETURNING id', [projectId]);
    res.json({ message: `Project with ID ${result.rows[0].id} deleted` });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

module.exports = router;
