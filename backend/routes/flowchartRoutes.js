const express = require("express");
const router = express.Router();
const flowchartController = require("../controllers/flowchartController");

// Route to create a new flowchart
router.post("/", flowchartController.createFlowchart); // POST / - Calls createFlowchart method in the controller

// Route to get all flowcharts
router.get("/", flowchartController.getFlowcharts); // GET / - Calls getFlowcharts method in the controller

// Route to get a flowchart by ID
router.get("/:id", flowchartController.getFlowchart); // GET /:id - Calls getFlowchart method in the controller

// Route to update a flowchart by ID
router.put("/:id", flowchartController.updateFlowchart); // PUT /:id - Calls updateFlowchart method in the controller

// Route to delete a flowchart by ID
router.delete("/:id", flowchartController.deleteFlowchart); // DELETE /:id - Calls deleteFlowchart method in the controller

module.exports = router; // Export the router
