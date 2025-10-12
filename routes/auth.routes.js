const authRoute = require("express").Router();
const { signup, signIn, signOut, sendOtp, verifyOtp, resetPassword, getData } = require("../controllers/auth.controller");
const authenticateToken = require("../middlewares/auth.middleware");

authRoute.post("/signup", signup);
authRoute.post("/signin", signIn);
authRoute.get("/signout", signOut);
authRoute.post("/sendotp", sendOtp);
authRoute.post("/verifyOtp", verifyOtp);
authRoute.post("/resetPassword", resetPassword);

// Protected route to test token expiration
authRoute.get("/profile", authenticateToken, (req, res) => {
    res.json({ message: 'Profile accessed', user: req.user });
});

authRoute.get("/getdata", getData);

module.exports = authRoute;
