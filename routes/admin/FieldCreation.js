const express = require('express');
const router = express.Router();
const pool = require('../../Admindb'); // Import the PostgreSQL pool

// Create a new field for the project with a name derived from the project_name
router.post('/fields', async (req, res) => {
  try {
    const { project_name, field_name, data_type } = req.body;

    // Add the new field as a column to the project table
    const addColumnQuery = `ALTER TABLE ${project_name} ADD COLUMN ${field_name} ${data_type}`;
    await pool.query(addColumnQuery);

    res.json({ message: `New field added to the table "${project_name}"` });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Rename an existing field and its data type in the project
router.put('/fields/rename', async (req, res) => {
  try {
    const { project_name, field_name, new_field_name, new_data_type } = req.body;

    // Check if the field exists in the project table
    const checkFieldQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = '${project_name}'
        AND column_name = '${field_name}'
      )
    `;
    const fieldExists = await pool.query(checkFieldQuery);

    // If the field does not exist, return an error response
    if (!fieldExists.rows[0].exists) {
      const errorMessage = `Field ${field_name} does not exist in table ${project_name}`;
      console.error(errorMessage);
      return res.status(404).json({ error: errorMessage });
    }

    // Prepare the rename query based on provided values
    let renameFieldQuery = '';
    if (new_field_name) {
      renameFieldQuery = `
        ALTER TABLE ${project_name}
        RENAME COLUMN ${field_name} TO ${new_field_name};
      `;
    }

    // If the new_data_type is provided and is different from the existing data type,
    // perform the data type conversion before altering the column
    if (new_data_type) {
      const checkDataTypeQuery = `
        SELECT data_type
        FROM information_schema.columns
        WHERE table_name = '${project_name}'
        AND column_name = '${field_name}'
      `;
      const dataTypeResult = await pool.query(checkDataTypeQuery);
      const existingDataType = dataTypeResult.rows[0].data_type;

      if (existingDataType !== new_data_type) {
        // Convert the existing data to the new data type (integer in this case)
        const convertDataTypeQuery = `
          ALTER TABLE ${project_name}
          ALTER COLUMN ${field_name} TYPE ${new_data_type}
          USING ${field_name}::${new_data_type};
        `;
        renameFieldQuery += convertDataTypeQuery;
      }
    }

    if (renameFieldQuery !== '') {
      await pool.query(renameFieldQuery);
    }

    res.json({ message: `Field ${field_name} renamed successfully` });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// Delete an existing field from the project
router.delete('/fields/delete', async (req, res) => {
  try {
    const { project_name, field_name } = req.body;

    // Check if the field exists in the project table
    const checkFieldQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = '${project_name}'
        AND column_name = '${field_name}'
      )
    `;
    const fieldExists = await pool.query(checkFieldQuery);

    // If the field does not exist, return an error response
    if (!fieldExists.rows[0].exists) {
      const errorMessage = `Field ${field_name} does not exist in table ${project_name}`;
      console.error(errorMessage);
      return res.status(404).json({ error: errorMessage });
    }

    // Delete the field from the project table
    const deleteFieldQuery = `ALTER TABLE ${project_name} DROP COLUMN ${field_name}`;
    await pool.query(deleteFieldQuery);

    res.json({ message: `Field ${field_name} deleted from table ${project_name}` });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

router.get('/fields/:project_name', async (req, res) => {
  try {
    const { project_name } = req.params;

    // Get all columns (fields) of the specified project table
    const getColumnsQuery = `
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = '${project_name}'
    `;
    const fieldsData = await pool.query(getColumnsQuery);

    res.json(fieldsData.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Other field management endpoints (get list, etc.) can be added here

module.exports = router;








// // Rename an existing field and its data type in the project
// router.put('/fields/rename', async (req, res) => {
//   try {
//     const { project_name, field_name, new_field_name, new_data_type } = req.body;

//     // Check if the field exists in the project table
//     const checkFieldQuery = `
//       SELECT EXISTS (
//         SELECT 1
//         FROM information_schema.columns
//         WHERE table_name = '${project_name}'
//         AND column_name = '${field_name}'
//       )
//     `;
//     const fieldExists = await pool.query(checkFieldQuery);

//     // If the field does not exist, return an error response
//     if (!fieldExists.rows[0].exists) {
//       const errorMessage = `Field ${field_name} does not exist in table ${project_name}`;
//       console.error(errorMessage);
//       return res.status(404).json({ error: errorMessage });
//     }

//     // Prepare the rename query based on provided values
//     let renameFieldQuery = '';
//     if (new_field_name && new_data_type) {
//       renameFieldQuery = `
//         ALTER TABLE ${project_name}
//         RENAME COLUMN ${field_name} TO ${new_field_name};
        
//         ALTER TABLE ${project_name}
//         ALTER COLUMN ${new_field_name} TYPE ${new_data_type};
//       `;
//     } else if (new_field_name) {
//       renameFieldQuery = `
//         ALTER TABLE ${project_name}
//         RENAME COLUMN ${field_name} TO ${new_field_name};
//       `;
//     } else if (new_data_type) {
//       renameFieldQuery = `
//         ALTER TABLE ${project_name}
//         ALTER COLUMN ${field_name} TYPE ${new_data_type};
//       `;
//     }

//     if (renameFieldQuery !== '') {
//       await pool.query(renameFieldQuery);
//     }

//     res.json({ message: `Field ${field_name} renamed successfully` });
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });



// // routes/admin/fields.js
// const express = require('express');
// const router = express.Router();
// const pool = require('../../Admindb'); // Import the PostgreSQL pool

// // Create a new field for a project
// router.post('/fields', async (req, res) => {
//   try {
//     const { project_name, field_name, data_type } = req.body;

//     // Insert the new field into the fields table
//     const newField = await pool.query(
//       'INSERT INTO fields (project_name, field_name, data_type) VALUES ($1, $2, $3) RETURNING *',
//       [project_name, field_name, data_type]
//     );

//     // Add the new field as a column to the project table
//     const addColumnQuery = `ALTER TABLE ${project_name} ADD COLUMN ${field_name} ${data_type}`;
//     await pool.query(addColumnQuery);

//     res.json(newField.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server error');
//   }
// });

// // Other field management endpoints (get list, delete) go here

// module.exports = router;
