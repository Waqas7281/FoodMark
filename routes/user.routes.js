const userRoute = require("express").Router();
const {getCurrentUser} = require("../controllers/user.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");


userRoute.get("/user-data", authenticateToken, getCurrentUser);




module.exports = userRoute;


