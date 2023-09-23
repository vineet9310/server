const express = require('express');
const router = express.Router();
const pool = require('../../Admindb'); // Import the PostgreSQL pool

router.post('/dpr', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const { project_name, start_time1, weather_forecast1, wind_speed1, visibility1, start_time2,weather_forecast2, wind_speed2, visibility2, prepared, checked, approved, signature1, signature2, signature3, total_work, total_done, todays_work, total_remaining} = req.body;


    await client.query(
      `INSERT INTO dpr2today (project_name,start_time, weather_forecast, wind_speed, visibility) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_name, start_time1, weather_forecast1, wind_speed1, visibility1]
    );

    await client.query(
      `INSERT INTO dpr2next_day (project_name,start_time,weather_forecast, wind_speed, visibility) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_name, start_time2,weather_forecast2, wind_speed2, visibility2]
    );


    await client.query(
      'INSERT INTO dpr4 (project_name, prepared, checked, approved, signature1, signature2, signature3) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [project_name, prepared, checked, approved, signature1, signature2, signature3]
    );
    

    
    await client.query(
      'INSERT INTO dpr6 (project_name, total_work, total_done, todays_work, total_remaining) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [project_name, total_work, total_done, todays_work, total_remaining]
    );
    

    client.release();

    res.status(200).json({ message: 'DPR Data inserted successfully.' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred' }); 
  }
});

router.post('/dpr1', async (req, res) => {
    try {
      const client = await pool.connect();
      
      const { project_name, name, designation, phone, hours_at_site} = req.body;
  
      // Insert into description table
      await client.query(
        `INSERT INTO dpr1 (project_name,name, designation, phone, hours_at_site) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [project_name, name, designation, phone, hours_at_site]
      );
  
      client.release();
  
      res.status(200).json({ message: 'DPR Data inserted successfully.' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'An error occurred' }); 
    }
  });

  router.post('/dpr2', async (req, res) => {
    try {
      const client = await pool.connect();
      
      const { project_name, equipment, serial_no, health_condition, remarks} = req.body;


  
      // Insert into mob_plan_schedule table
      await client.query(
        `INSERT INTO dpr3 (project_name, equipment, serial_no, health_condition, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [project_name, equipment, serial_no, health_condition, remarks]
      );
  
      client.release();
  
      res.status(200).json({ message: 'DPR Data inserted successfully.' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  router.post('/dpr3', async (req, res) => {
    try {
      const client = await pool.connect();
      
      const { project_name,flight_no, equipment2, flight_start_time, flight_end_time, remark} = req.body;
  
 
      
      await client.query(
        'INSERT INTO dpr5 (project_name,  flight_no, equipment, flight_start_time, flight_end_time, remark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [project_name, flight_no, equipment2, flight_start_time, flight_end_time, remark]
      );
      
      client.release();
  
      res.status(200).json({ message: 'DPR Data inserted successfully.' });
    } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'An error occurred' }); 
    }
  });
  


module.exports = router;