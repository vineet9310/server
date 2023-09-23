const jwt = require("jsonwebtoken");
require("dotenv").config();

function authorize(req, res, next) {
  try {
    const jwtToken = req.header("token");

    // check if token exists
    if (!jwtToken) {
      console.log("no token found");
      return res.json(false);
    }

    // verify token
    const payload = jwt.verify(jwtToken, process.env.jwtSecret);

    // attach user id to request object
    req.user = payload.user;

    console.log("user ID attached to request object: ", req.user);

    next();
  } catch (err) {
    console.error(err.message);
    return res.status(403).json("Not Authorized");
  }
}

module.exports = authorize;
