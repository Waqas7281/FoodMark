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
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin === "http://localhost:5173") return callback(null, true);

      // Allow Vercel deployed frontends (remove trailing slash if present)
      if (origin.endsWith('.vercel.app')) return callback(null, true);

      // Allow specific frontend URL if set (remove trailing slash if present)
      if (process.env.FRONTEND_URL) {
        const allowedOrigin = process.env.FRONTEND_URL.replace(/\/$/, ''); // Remove trailing slash
        if (origin === allowedOrigin) return callback(null, true);
      }

      // Reject other origins
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
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
connectDB().catch((err) => {
  console.error("DB connection failed:", err);
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

module.exports = app;
