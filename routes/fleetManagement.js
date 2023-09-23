const express = require("express");
const router = express.Router();
const fleet = require("../fleetdb");
const validInfo = require("../middleware/validInfo");
const multer = require('multer');
const path = require('path');

// Set up multer middleware for handling file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'C:/Users/shiva/OneDrive/Desktop/New folder/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}` )
    }
  })
});

// Authentication
router.get('/droneteam', async (req, res) => {
  try {
    const result = await fleet.query('SELECT * FROM project');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Handle form submission with file upload
router.post('/droneteam', upload.single('pilot_health_img'), validInfo, async (req, res) => {
  const { project_code, mobilization_from, mobilization_to, pilot_name, pilot_health, pilot_health_img, pilot_health_video, copilot_name, copilot_health, copilot_health_img, copilot_health_video, batteries, batteries_serial_no, batteries_health, batteries_health_img, batteries_health_video, emlids, emlid_serial_no, emlid_health, emlid_health_img, emlid_health_video, poles, pole_health, pole_health_img, pole_health_video, drone, drone_health, drone_health_img, drone_health_video, car, car_health, car_health_img, car_health_video } = req.body;

  // Check that the file was uploaded successfully
  if (req.file) {
    console.log(req.body);
    console.log(req.file);
  } else {
    console.log("No file uploaded");
  }

  try {
    const result = await fleet.query(
      'INSERT INTO drone_team (project_code, mobilization_from, mobilization_to, pilot_name, pilot_health, pilot_health_img, pilot_health_video, copilot_name, copilot_health, copilot_health_img, copilot_health_video, batteries, batteries_serial_no, batteries_health, batteries_health_img, batteries_health_video, emlids, emlid_serial_no, emlid_health, emlid_health_img, emlid_health_video, poles, pole_health, pole_health_img, pole_health_video, drone, drone_health, drone_health_img, drone_health_video, car, car_health, car_health_img, car_health_video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33)',
      [project_code, mobilization_from, mobilization_to, pilot_name, pilot_health, pilot_health_img, pilot_health_video, copilot_name, copilot_health, copilot_health_img, copilot_health_video, batteries, batteries_serial_no, batteries_health, batteries_health_img, batteries_health_video, emlids, emlid_serial_no, emlid_health, emlid_health_img, emlid_health_video, poles, pole_health, pole_health_img, pole_health_video, drone, drone_health, drone_health_img, drone_health_video, car, car_health, car_health_img, car_health_video]
    );
    res.status(201).json({ message: 'Drone team details added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/drone-team', async (req, res) => {
  const { projectCode } = req.body;
  const projectCodeExists = await dbUtils.checkProjectCodeExists(projectCode);
  
  if (projectCodeExists) {
    return res.status(409).json({ error: 'Project code already exists' });
  }
  
  // Continue with the insertion logic
  // ...
});



module.exports = router;





// // Authentication

// router.get('/droneteam', async (req, res) => {
//   try {
//     const result = await fleet.query('SELECT * FROM project');
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// // router.post('/droneteam', validInfo, async (req, res) => {
// //   const {project_code,mobilization_from,mobilization_to,pilot_name, pilot_health, pilot_health_img, pilot_health_video, copilot_name, copilot_health, copilot_health_img, copilot_health_video, batteries, batteries_serial_no, batteries_health, batteries_health_img, batteries_health_video, emlids, emlid_serial_no, emlid_health, emlid_health_img, emlid_health_video, poles, pole_health, pole_health_img, pole_health_video, drone, drone_health, drone_health_img, drone_health_video, car, car_health, car_health_img, car_health_video } = req.body;
// //   try {
// //     const result = await fleet.query(
// //       'INSERT INTO drone_team (project_code, mobilization_from, mobilization_to, pilot_name, pilot_health, pilot_health_img, pilot_health_video, copilot_name, copilot_health, copilot_health_img, copilot_health_video, batteries, batteries_serial_no, batteries_health, batteries_health_img, batteries_health_video, emlids, emlid_serial_no, emlid_health, emlid_health_img, emlid_health_video, poles, pole_health, pole_health_img, pole_health_video, drone, drone_health, drone_health_img, drone_health_video, car, car_health, car_health_img, car_health_video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33) RETURNING *',
// //       [ project_code,mobilization_from,mobilization_to,pilot_name, pilot_health, pilot_health_img, pilot_health_video, copilot_name, copilot_health, copilot_health_img, copilot_health_video, batteries, batteries_serial_no, batteries_health, batteries_health_img, batteries_health_video, emlids, emlid_serial_no, emlid_health, emlid_health_img, emlid_health_video, poles, pole_health, pole_health_img, pole_health_video, drone, drone_health, drone_health_img, drone_health_video, car, car_health, car_health_img, car_health_video]
// //     );
// //     res.json(result.rows[0]);
// //     console.log("drone team detals upload successfully")
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: 'Internal server error' });
// //   }
// // });

// // Configure Multer for file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const fileExtension = path.extname(file.originalname);
//     const fileName = file.fieldname + '-' + uniqueSuffix + fileExtension;
//     cb(null, fileName);
//   }
// });

// const upload = multer({ storage });

// // API FOR ENTERINRING DRONE TEAM DETALS
// // API FOR ENTERING DRONE TEAM DETAILS
// router.post('/droneteam', upload.fields([
//   { name: 'pilot_health_img', maxCount: 1 },
//   { name: 'pilot_health_video', maxCount: 1 },
//   { name: 'copilot_health_img', maxCount: 1 },
//   { name: 'copilot_health_video', maxCount: 1 },
//   { name: 'batteries_health_img', maxCount: 1 },
//   { name: 'batteries_health_video', maxCount: 1 },
//   { name: 'emlid_health_img', maxCount: 1 },
//   { name: 'emlid_health_video', maxCount: 1 },
//   { name: 'pole_health_img', maxCount: 1 },
//   { name: 'pole_health_video', maxCount: 1 },
//   { name: 'drone_health_img', maxCount: 1 },
//   { name: 'drone_health_video', maxCount: 1 },
//   { name: 'car_health_img', maxCount: 1 },
//   { name: 'car_health_video', maxCount: 1 }
// ]), async (req, res) => {
//   const {
//     project_code, mobilization_from, mobilization_to,
//     pilot_name, pilot_health, copilot_name, copilot_health,
//     batteries, batteries_serial_no, batteries_health,
//     emlids, emlid_serial_no, emlid_health,
//     poles, pole_health, drone, drone_health, car, car_health
//   } = req.body;

//   try {
//     const pilotHealthImg = req.files['pilot_health_img'][0].filename;
//     const pilotHealthVideo = req.files['pilot_health_video'][0].filename;
//     const copilotHealthImg = req.files['copilot_health_img'][0].filename;
//     const copilotHealthVideo = req.files['copilot_health_video'][0].filename;
//     const batteriesHealthImg = req.files['batteries_health_img'][0].filename;
//     const batteriesHealthVideo = req.files['batteries_health_video'][0].filename;
//     const emlidHealthImg = req.files['emlid_health_img'][0].filename;
//     const emlidHealthVideo = req.files['emlid_health_video'][0].filename;
//     const poleHealthImg = req.files['pole_health_img'][0].filename;
//     const poleHealthVideo = req.files['pole_health_video'][0].filename;
//     const droneHealthImg = req.files['drone_health_img'][0].filename;
//     const droneHealthVideo = req.files['drone_health_video'][0].filename;
//     const carHealthImg = req.files['car_health_img'][0].filename;
//     const carHealthVideo = req.files['car_health_video'][0].filename;

//     const result = await pool.query(
//       'INSERT INTO drone_team (project_code, mobilization_from, mobilization_to, pilot_name, pilot_health, pilot_health_img, pilot_health_video, copilot_name, copilot_health, copilot_health_img, copilot_health_video, batteries, batteries_serial_no, batteries_health, emlids, emlid_serial_no, emlid_health, poles, pole_health, pole_health_img, pole_health_video, drone, drone_health, drone_health_img, drone_health_video, car, car_health, car_health_img, car_health_video) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)',
//       [
//         project_code, mobilization_from, mobilization_to,
//         pilot_name, pilot_health, pilotHealthImg, pilotHealthVideo,
//         copilot_name, copilot_health, copilotHealthImg, copilotHealthVideo,
//         batteries, batteries_serial_no, batteries_health,
//         emlids, emlid_serial_no, emlid_health,
//         poles, pole_health, poleHealthImg, poleHealthVideo,
//         drone, drone_health, droneHealthImg, droneHealthVideo,
//         car, car_health, carHealthImg, carHealthVideo
//       ]
//     );

//     res.json(result.rows[0]);
//     console.log("Drone team details uploaded successfully");
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;      e