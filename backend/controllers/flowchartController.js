const Flowchart = require("../models/Flowchart");
const Email = require("../models/Email");
const agenda = require("../config/agenda");

// Get all flowcharts
exports.getFlowcharts = async (req, res) => {
  try {
    // Fetch all flowcharts from the database
    const flowcharts = await Flowchart.find();

    // Send the retrieved flowcharts in the response with a 200 status code
    res.status(200).json(flowcharts);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error fetching flowcharts:", error);

    // Send a 500 status code with an error message if an error occurs
    res
      .status(500)
      .json({ message: "Error fetching flowcharts", error: error.message });
  }
};

// Create a new flowchart
exports.createFlowchart = async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    // Create a new flowchart instance with provided data
    const flowchart = new Flowchart({
      name,
      nodes: nodes.map((node) => ({
        ...node,
        _id: node.id, // Use the frontend-generated id as the MongoDB _id
      })),
      edges: edges.map((edge) => ({
        source: edge.source,
        target: edge.target,
      })),
    });

    // Save the new flowchart to the database
    await flowchart.save();

    const savedTime = flowchart.createdAt;
    let cumulativeDelay = 0;

    // Iterate over each node to handle wait and email nodes
    for (const node of flowchart.nodes) {
      if (node.type === "wait") {
        // Calculate delay for wait nodes
        cumulativeDelay += calculateDelay(node.data);
      } else if (node.type === "email") {
        const sendAt = new Date(savedTime.getTime() + cumulativeDelay);

        // Find the lead node for recipient information
        const leadNode = flowchart.nodes.find((n) => n.type === "lead");
        if (!leadNode) {
          throw new Error("Lead node not found in flowchart.");
        }

        // Set recipient and email details
        const recipient = leadNode.data.emails;

        const email = new Email({
          recipient: recipient,
          subject: node.data.subject || "No subject",
          text: node.data.body || "No content",
          sendAt: sendAt,
          sent: false,
        });

        // Save the email and schedule it with agenda
        await email.save();
        await agenda.schedule(sendAt, "send email", { emailId: email._id });
      }
    }

    // Respond with the created flowchart
    res.status(201).json(flowchart);
  } catch (error) {
    // Handle validation or creation errors
    res.status(400).json({ message: error.message });
  }
};

// Get a specific flowchart by ID
exports.getFlowchart = async (req, res) => {
  try {
    // Find the flowchart by ID
    const flowchart = await Flowchart.findById(req.params.id);
    if (!flowchart)
      return res.status(404).json({ message: "Flowchart not found" });

    // Respond with the found flowchart
    res.json(flowchart);
  } catch (error) {
    // Handle errors during retrieval
    res.status(500).json({ message: error.message });
  }
};

// Update a specific flowchart by ID
exports.updateFlowchart = async (req, res) => {
  try {
    const { name, nodes, edges } = req.body;

    // Update the flowchart with new data
    const updatedFlowchart = await Flowchart.findByIdAndUpdate(
      req.params.id,
      {
        name,
        nodes: nodes.map((node) => ({
          ...node,
          _id: node.id, // Use the frontend-generated id as the MongoDB _id
        })),
        edges: edges.map((edge) => ({
          source: edge.source,
          target: edge.target,
        })),
      },
      { new: true }
    );

    if (!updatedFlowchart)
      return res.status(404).json({ message: "Flowchart not found" });

    // Respond with the updated flowchart
    res.json(updatedFlowchart);
  } catch (error) {
    // Handle errors during update
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific flowchart by ID
exports.deleteFlowchart = async (req, res) => {
  try {
    // Find and delete the flowchart by ID
    const flowchart = await Flowchart.findByIdAndDelete(req.params.id);
    if (!flowchart)
      return res.status(404).json({ message: "Flowchart not found" });

    // Respond with a deletion message
    res.json({ message: "Flowchart deleted" });
  } catch (error) {
    // Handle errors during deletion
    res.status(500).json({ message: error.message });
  }
};

// Calculate delay in milliseconds based on the given data
function calculateDelay(data) {
  const { duration, unit = "minutes" } = data;
  const value = parseInt(duration, 10) || 0;

  // Convert delay based on unit
  switch ((unit || "").toLowerCase()) {
    case "minutes":
      return value * 60 * 1000;
    case "hours":
      return value * 60 * 60 * 1000;
    case "days":
      return value * 24 * 60 * 60 * 1000;
    default:
      return 0;
  }
}
