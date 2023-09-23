const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();

//middleware

app.use(cors());
app.use(express.json());

//routes
// app.use("/authentication", require("./routes/jwtAuth"));
// app.use("/authentication", require("./routes/fleetManagement"));
app.use("/authentication", require("./routes/loginauth"));
app.use("/dashboard", require("./routes/dashboard"));
app.use("/Admin", require("./routes/admin/ProjectCreation"))
app.use("/Admin", require("./routes/admin/FieldCreation"))
app.use("/Admin", require("./routes/admin/FieldValue"))
app.use("/Admin", require("./routes/admin/ProjectAssisment"))
app.use("/Admin", require("./routes/admin/AcessPfd"))
app.use("/Pilot", require("./routes/pilot/ProjectFieldfill"))
app.use("/Pilot", require("./routes/pilot/Dpr"))

app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});
