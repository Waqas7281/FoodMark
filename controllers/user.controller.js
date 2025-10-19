const User = require("../models/user.model");

const getCurrentUser = async (req, res) => {
  try {
    console.log("req.user:", req.user._id); // Debug log
    const userId = req.user._id;
    console.log("userId:", userId); // Debug log
    if (!userId) {
      return res.status(400).json({ message: "userId not found" });
    }
    const user = await User.findById(userId);
    console.log("user:", user); // Debug log
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error); // Debug log
    return res.status(500).json({ message: "get current user error", error: error.message });
  }
};

module.exports = {
  getCurrentUser,
};
