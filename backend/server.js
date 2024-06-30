require("dotenv").config(); // Load environment variables from a .env file
const express = require("express"); // Import Express framework
const mongoose = require("mongoose"); // Import Mongoose for MongoDB interactions
const flowchartRoutes = require("./routes/flowchartRoutes"); // Import flowchart routes
const agenda = require("./config/agenda"); // Import Agenda for job scheduling
const cors = require("cors");

const app = express(); // Create an Express application

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cors()); // Use CORS middleware

// Connect to MongoDB using Mongoose
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  })
  .then(() => console.log("Connected to MongoDB")) // Log success message
  .catch((err) => console.error("Could not connect to MongoDB", err)); // Log error message

mongoose.set("strictQuery", true); // Enable strict mode for queries

app.use("/api/flowcharts", flowchartRoutes); // Use flowchart routes for any requests to /api/flowcharts

const PORT = process.env.PORT || 5000; // Set the port from environment variable or default to 5000

// Start the server and Agenda
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`); // Log the port the server is running on
  agenda.start(); // Start Agenda for job scheduling
});
