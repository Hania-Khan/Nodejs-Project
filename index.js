const express = require("express");
const mongoose = require("mongoose");
// const sequelize = require("./sequelize");
const morgan = require("morgan");
const cors = require("cors");
const { Kafka } = require("kafkajs");
require("dotenv").config();

// const notificationRoutes = require("./route/mysql-route/notificationRoutesMysql");
// const userRoutes = require("./route/mysql-route/userRoutesMysql");

const notificationRoutes = require("./route/mongo-route/notificationRoutesMongo");
const userRoutes = require("./route/mongo-route/userRoutesMongo");

const { runProducer } = require("./Kafka/producer");
const { runConsumer } = require("./Kafka/consumer");

const app = express();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// // Test MySQL Connection
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("✅ MySQL connected.");
//   })
//   .catch((err) => {
//     console.error("❌ MySQL connection failed:", err);
//   });

// // ✅ Sync all Sequelize models
// sequelize
//   .sync({ alter: true }) // or { force: true } to recreate tables every time
//   .then(() => {
//     console.log("✅ All models synced to MySQL.");
//   })
//   .catch((err) => {
//     console.error("❌ Model sync failed:", err);
//   });

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
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

// Start the server
const PORT = process.env.APP_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const startKafka = async () => {
//   try {
//     await runProducer();
//     await runConsumer();
//   } catch (err) {
//     console.error("Error starting Kafka services:", err);
//   }
// };

// startKafka();
