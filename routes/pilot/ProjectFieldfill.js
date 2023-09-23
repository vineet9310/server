// Import necessary libraries
const express = require('express');
const router = express.Router();
const pool = require('../../Pilotdb'); // Import the PostgreSQL pool

let createdProjectName = ''; // Variable to store the created project name

// Add a new route to fetch the created project name
router.get('/created-project', async (req, res) => {
  try {
    res.json({ createdProjectName });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Fetch all project names
router.get('/projects', async (req, res) => {
  try {
    const getAllProjectsQuery = `
      SELECT table_name AS project_name
      FROM information_schema.tables
      WHERE table_schema = 'public'; -- You can replace 'public' with your schema name if it's different
    `;
    const projects = await pool.query(getAllProjectsQuery);
    const projectNames = projects.rows.map((project) => project.project_name);

    res.json(projectNames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Save data for the selected project
router.post('/projects/:project_name/save-data', async (req, res) => {
  const { project_name } = req.params;
  const { date, area, village, taluka, district } = req.body;
  try {
    // Insert the data into the selected project table
    const insertDataQuery = `
      INSERT INTO ${project_name} (date, area, village, taluka, district)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertDataQuery, [date, area, village, taluka, district]);

    res.json({ message: 'Data saved successfully' });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Placeholder route to handle KML file upload and data fetch
router.post('/projects/:project_name/upload-kml', async (req, res) => {
  // Placeholder code to handle KML file upload and data fetch
  // You can implement the logic to extract data from the KML file and save it to the project table
  try {
    const { project_name } = req.params;
    // Implement KML data extraction and saving here
    res.json({ message: 'KML data fetched and saved successfully' });
  } catch (error) {
    console.error('Error fetching and saving KML data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Other routes related to file uploads and data fetching from KML files can be implemented here

module.exports = router;
