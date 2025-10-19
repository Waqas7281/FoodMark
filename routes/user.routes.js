const userRoute = require("express").Router();
const {getCurrentUser} = require("../controllers/user.controller.js");
const authenticateToken = require("../middlewares/auth.middleware.js");


userRoute.get("/user-data", authenticateToken, getCurrentUser);


// Protected route to test token expiration
userRoute.get("/current", authenticateToken, (req, res) => {
    res.json({ message: 'Profile accessed', user: req.user });
});

module.exports = userRoute;


