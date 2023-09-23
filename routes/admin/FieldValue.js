const express = require('express');
const router = express.Router();
const pool = require('../../Admindb'); // Import the PostgreSQL pool

router.post('/description', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const { project_name, scope1, deliverables1, permission1, location1, sop_details1, equipments1, productivity1, manpower1, mob_plan_schedule1, constraints1, scope2, deliverables2, permission2, location2, sop_details2, equipments2, productivity2, manpower2, mob_plan_schedule2, constraints2, scope3, deliverables3, permission3, location3, sop_details3, equipments3, productivity3, manpower3, mob_plan_schedule3, constraints3, date1, description1, name_of_the_person1, date2, description2, name_of_the_person2,customer, dd_project, pmo_office_coordinator, as_update_on_date } = req.body;

    // Insert into description table
    await client.query(
      `INSERT INTO description (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [project_name, scope1, deliverables1, permission1, location1, sop_details1, equipments1, productivity1, manpower1, mob_plan_schedule1, constraints1]
    );

    // Insert into status table
    await client.query(
      `INSERT INTO status (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [project_name, scope2, deliverables2, permission2, location2, sop_details2, equipments2, productivity2, manpower2, mob_plan_schedule2, constraints2]
    );

    // Insert into immediate_action_required table
    await client.query(
      `INSERT INTO immediate_action_required (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [project_name, scope3, deliverables3, permission3, location3, sop_details3, equipments3, productivity3, manpower3, mob_plan_schedule3, constraints3]
    );

    // Insert into mob_plan_schedule table
    await client.query(
      `INSERT INTO mob_plan_schedule (project_name, date1, description1, name_of_the_person1, date2, description2, name_of_the_person2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [project_name, date1, description1, name_of_the_person1, date2, description2, name_of_the_person2]
    );

    await client.query(
      'INSERT INTO projects (project_name, customer, dd_project, pmo_office_coordinator, as_update_on_date) VALUES ($1, $2, $3, $4, $5) RETURNING id, project_name',
      [project_name, customer, dd_project, pmo_office_coordinator, as_update_on_date]
    );
    
    client.release();

    res.status(200).json({ message: 'Data inserted successfully.' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred' }); 
  }
});

router.post('/dpr', async (req, res) => {
  try {
    const client = await pool.connect();
    
    const { project_name, name, designation, phone, hours_at_site, start_time1, weather_forecast1, wind_speed1, visibility1, start_time2,weather_forecast2, wind_speed2, visibility2, equipment, serial_no, health_condition, remarks, prepared, checked, approved, signature1, signature2, signature3, flight_no, equipment2, flight_start_time, flight_end_time, remark, total_work, total_done, todays_work, total_remaining} = req.body;

    // Insert into description table
    await client.query(
      `INSERT INTO dpr1 (project_name,name, designation, phone, hours_at_site) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_name, name, designation, phone, hours_at_site]
    );

    // Insert into status table
    await client.query(
      `INSERT INTO dpr2today (project_name,start_time, weather_forecast, wind_speed, visibility) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_name, start_time1, weather_forecast1, wind_speed1, visibility1]
    );

    // Insert into immediate_action_required table
    await client.query(
      `INSERT INTO dpr2next_day (project_name,start_time,weather_forecast, wind_speed, visibility) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_name, start_time2,weather_forecast2, wind_speed2, visibility2]
    );

    // Insert into mob_plan_schedule table
    await client.query(
      `INSERT INTO dpr3 (project_name, equipment, serial_no, health_condition, remarks) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [project_name, equipment, serial_no, health_condition, remarks]
    );

    await client.query(
      'INSERT INTO dpr4 (project_name, prepared, checked, approved, signature1, signature2, signature3) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [project_name, prepared, checked, approved, signature1, signature2, signature3]
    );
    
    await client.query(
      'INSERT INTO dpr5 (project_name,  flight_no, equipment, flight_start_time, flight_end_time, remark) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [project_name, flight_no, equipment2, flight_start_time, flight_end_time, remark]
    );
    
    await client.query(
      'INSERT INTO dpr6 (project_name, total_work, total_done, todays_work, total_remaining) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [project_name, total_work, total_done, todays_work, total_remaining]
    );
    

    client.release();

    res.status(200).json({ message: 'DPR Data inserted successfully.' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'An error occurred' }); 
  }
});
router.post('/inventories', async (req, res) => {
  const { Category, SubCategory, Abbreviation, Make, ModelProductNo, SerialNoProductID, Dept, InternalSINo, SKUCode, Name, Remark } = req.body;

  try {
     await pool.query(
      'INSERT INTO inventories (Category, SubCategory, Abbreviation, Make, ModelProductNo, SerialNoProductID, Dept, InternalSINo, SKUCode, Name, Remark) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [Category, SubCategory, Abbreviation, Make, ModelProductNo, SerialNoProductID, Dept, InternalSINo, SKUCode, Name, Remark]
    );
    
    res.status(201).json({ message: 'Inventory created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error creating product' });
  }
});



// Create a new repair list item
router.post('/repair-list', async (req, res) => {
  const { Date, TypeOfItems, Brand, SerialNoProductId, Quantity, RepairedStatus, Remark } = req.body;

  try {
     await pool.query(
      'INSERT INTO RepairList (Date, TypeOfItems, Brand, SerialNoProductId, Quantity, RepairedStatus, Remark) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [Date, TypeOfItems, Brand, SerialNoProductId, Quantity, RepairedStatus, Remark]
    );
    
    res.status(201).json({ message: 'Repair list item created successfully.' });
  } catch (error) {
    console.error('Error creating repair list item:', error);
    res.status(500).json({ error: 'An error occurred while creating repair list item.' });
  }
});

// Create a new shipment
router.post('/shipments', async (req, res) => {
  const {
    Date,TypeOfItems, Brand,  SerialNoProductId,  Quantity,  TransferLocation,  TransferDestination,  ShippedBy,  Repair,  SentByEmployee,} = req.body;

  try {
     await pool.query(
      'INSERT INTO ItemShipment (Date, TypeOfItems, Brand, SerialNoProductId, Quantity, TransferLocation, TransferDestination, ShippedBy, Repair, SentByEmployee) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [
        Date,  TypeOfItems,  Brand,  SerialNoProductId,  Quantity,  TransferLocation,  TransferDestination,  ShippedBy,  Repair,  SentByEmployee,]
    );
    
    res.status(201).json({ message: 'Shipment created successfully' });
  } catch (error) {
    console.error('Error creating shipment:', error);
    res.status(500).json({ error: 'An error occurred while creating the shipment' });
  }
});




























// router.post('/description', async (req, res) => {
//   try {

//     const client = await pool.connect();

//     const { project_name, scope1, deliverables1, permission1, location1, sop_details1, equipments1, productivity1, manpower1, mob_plan_schedule1, constraints1, scope2, deliverables2, permission2, location2, sop_details2, equipments2, productivity2, manpower2, mob_plan_schedule2, constraints2,scope3, deliverables3, permission3, location3, sop_details3, equipments3, productivity3, manpower3, mob_plan_schedule3, constraints3, date1, description1, name_of_the_person1, date2, description2, name_of_the_person2 } = req.body;
//     await client.query(
//       `INSERT INTO description (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//       [project_name, scope1, deliverables1, permission1, location1, sop_details1, equipments1, productivity1, manpower1, mob_plan_schedule1, constraints1]
//     );

//     await client.query(
//       `INSERT INTO status (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//       [project_name, scope2, deliverables2, permission2, location2, sop_details2, equipments2, productivity2, manpower2, mob_plan_schedule2, constraints2]
//     );

//     await client.query(
//       `INSERT INTO immediate_action_required (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//       [project_name, scope3, deliverables3, permission3, location3, sop_details3, equipments3, productivity3, manpower3, mob_plan_schedule3, constraints3]
//     );

//     await client.query(
//       `INSERT INTO mob_plan_schedule (project_name, date1, description1, name_of_the_person1, date2, description2, name_of_the_person2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       [project_name, date1, description1, name_of_the_person1, date2, description2, name_of_the_person2]
//     );
    

//     client.release();


//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error inserting data into description table:', error);
//     res.status(500).json({ error: 'An error occurred' }); 
//   }
// });








// // Create and Update API for description table
// router.post('/description', async (req, res) => {
//   const { project_name1, scope1, deliverables1, permission1, location1, sop_details1, equipments1, productivity1, manpower1, mob_plan_schedule1, constraints1 } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO description (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//       [project_name1, scope1, deliverables1, permission1, location1, sop_details1, equipments1, productivity1, manpower1, mob_plan_schedule1, constraints1]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error inserting data into description table:', error);
//     res.status(500).json({ error: 'An error occurred' }); 
//   }
// });



// // Create and Update API for immediate_action_required table
// router.post('/immediate_action_required', async (req, res) => {
//   const { project_name2, scope2, deliverables2, permission2, location2, sop_details2, equipments2, productivity2, manpower2, mob_plan_schedule2, constraints2 } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO description (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//       [project_name2, scope2, deliverables2, permission2, location2, sop_details2, equipments2, productivity2, manpower2, mob_plan_schedule2, constraints2]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error inserting data into description table:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// // Create and Update API for status table
// router.post('/status', async (req, res) => {
//   const { project_name3, scope3, deliverables3, permission3, location3, sop_details3, equipments3, productivity3, manpower3, mob_plan_schedule3, constraints3 } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO description (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//       [project_name3, scope3, deliverables3, permission3, location3, sop_details3, equipments3, productivity3, manpower3, mob_plan_schedule3, constraints3]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error inserting data into description table:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// // Create and Update API for mob_plan_schedule table

// router.post('/mob_plan_schedule', async (req, res) => {
//   const { project_name, date1, discription1, name_of_the_Persion1, date2, discription2, name_of_the_Persion2 } = req.body;
//   try {
//     const result = await pool.query(
//       `INSERT INTO description (project_name, date1, discription1, name_of_the_Persion1, date2, discription2, name_of_the_Persion2) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
//       [project_name, date1, discription1, name_of_the_Persion1, date2, discription2, name_of_the_Persion2]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error inserting data into description table:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// router.put('/description/:project_name', async (req, res) => {
//   const project_name = req.params.project_name;
//   const { scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints } = req.body;
//   try {
//     const result = await pool.query(
//       `UPDATE description SET scope = $1, deliverables = $2, permission = $3, location = $4, sop_details = $5, equipments = $6, productivity = $7, manpower = $8, mob_plan_schedule = $9, constraints = $10 WHERE project_name = $11 RETURNING *`,
//       [scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints, project_name]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating data in description table:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// router.put('/immediate_action_required/:project_name', async (req, res) => {
//   // Similar to description table, update code
// });

// router.put('/status/:project_name', async (req, res) => {
//   // Similar to description table, update code
// });


// router.post('/description', async (req, res) => {
//   const {
//     project_name,
//     scope,
//     deliverables,
//     permission,
//     location,
//     sop_details,
//     equipments,
//     productivity,
//     manpower,
//     mob_plan_schedule,
//     constraints
//   } = req.body;

//   try {
//     const result = await pool.query(
//       `INSERT INTO description 
//       (project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints) 
//       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
//       [project_name, scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error inserting data into description table:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });

// router.put('/description/:project_name', async (req, res) => {
//   const project_name = req.params.project_name;
//   const {
//     scope,
//     deliverables,
//     permission,
//     location,
//     sop_details,
//     equipments,
//     productivity,
//     manpower,
//     mob_plan_schedule,
//     constraints
//   } = req.body;

//   try {
//     const result = await pool.query(
//       `UPDATE description 
//       SET scope = $1, deliverables = $2, permission = $3, location = $4, 
//       sop_details = $5, equipments = $6, productivity = $7, manpower = $8, 
//       mob_plan_schedule = $9, constraints = $10 
//       WHERE project_name = $11 RETURNING *`,
//       [scope, deliverables, permission, location, sop_details, equipments, productivity, manpower, mob_plan_schedule, constraints, project_name]
//     );
//     res.json(result.rows[0]);
//   } catch (error) {
//     console.error('Error updating data in description table:', error);
//     res.status(500).json({ error: 'An error occurred' });
//   }
// });


module.exports = router;
