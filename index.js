const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const notificationRoutes = require("./route/notificationRoutes");
const userRoutes = require("./route/userRoutes");

const app = express();

app.use(express.json()); 
app.use(morgan("dev"));
app.use(cors()); 

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Routes
app.use("/api/v1/notifications", notificationRoutes); 
app.use("/api/v1/users", userRoutes); 

// Root route
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the Notification API!");
});

// Handle 404 errors
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
