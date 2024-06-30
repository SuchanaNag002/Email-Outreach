const mongoose = require("mongoose");

// Define the schema for a flowchart
const flowchartSchema = new mongoose.Schema({
  // Flowchart name with a default value
  name: { type: String, required: true, default: "Untitled Flowchart" },

  // Nodes array, each with a unique ID, type, data, and position
  nodes: [
    {
      _id: { type: String, required: true },
      type: { type: String, enum: ["lead", "wait", "email"], required: true },
      data: { type: mongoose.Schema.Types.Mixed }, // Stores additional data for the node
      position: {
        x: Number, // X-coordinate of the node
        y: Number, // Y-coordinate of the node
      },
    },
  ],

  // Edges array defining connections between nodes
  edges: [
    {
      source: { type: String, required: true }, // ID of the source node
      target: { type: String, required: true }, // ID of the target node
    },
  ],

  // Timestamp of when the flowchart was created
  createdAt: { type: Date, default: Date.now },
});

// Export the model based on the schema
module.exports = mongoose.model("Flowchart", flowchartSchema);
