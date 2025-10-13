const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require("./Config/db");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.routes");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173", // Replace with your frontend URL
    credentials: true,
  }),
  console.log(process.env.FRONTEND_URL)
);

app.use(express.json());
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res
      .status(400)
      .json({ message: "Invalid JSON format in request body" });
  }
  next(err);
});
app.use(cookieParser());

// Root route for Vercel deployment
app.get("/", (req, res) => {
  res.json({ message: "FoodCover API is running" });
});

app.use("/api/auth", authRouter);

// Connect to DB on startup (for serverless compatibility)
connectDB();

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
