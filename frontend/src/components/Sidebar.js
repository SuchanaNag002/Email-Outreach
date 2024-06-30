import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getFlowcharts } from "../services/api";
import { useAuth } from "../context/authContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const { logout } = useAuth(); // Accessing logout function from AuthContext
  const navigate = useNavigate(); // Hook for programmatic navigation
  const [flowcharts, setFlowcharts] = useState([]); // State to store fetched flowcharts
  const nodeTypes = ["lead", "wait", "email"]; // List of node types for drag-and-drop

  // Function to handle drag start event for nodes
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType); // Setting node type for drag-and-drop
    event.dataTransfer.effectAllowed = "move";
  };

  // Effect to fetch flowcharts on component mount
  useEffect(() => {
    const fetchFlowcharts = async () => {
      try {
        const fetchedFlowcharts = await getFlowcharts(); // Fetching flowcharts from API
        setFlowcharts(fetchedFlowcharts); // Setting fetched flowcharts in state
      } catch (error) {
        console.error("Error fetching flowcharts:", error); // Logging error if fetch fails
      }
    };

    fetchFlowcharts(); // Calling fetchFlowcharts function
  }, [flowcharts]);

  // Function to handle sign out
  const handleSignOut = async () => {
    try {
      await logout(); // Calling logout function from AuthContext
    } catch (error) {
      console.error("Error signing out:", error); // Logging error if sign out fails
    }
  };

  // Function to navigate to create new flowchart page
  const handleCreateNewFlowchart = () => {
    navigate("/"); // Navigating to root path ("/") for creating a new flowchart
  };

  return (
    <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Nodes</h2>
      <div className="nodes-list-sidebar flex-col">
        {/* Mapping through node types for sidebar */}
        {nodeTypes.map((nodeType) => (
          <div
            key={nodeType}
            className={`node-item-sidebar ${nodeType}-node-sidebar p-2 mb-2 cursor-pointer border rounded bg-white shadow-sm hover:shadow-md transition-shadow duration-300`}
            draggable
            onDragStart={(event) => onDragStart(event, nodeType)} // Handling drag start event
          >
            {nodeType.charAt(0).toUpperCase() + nodeType.slice(1)} node{" "}
            {/* Displaying node type */}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Saved Flowcharts</h2>
      <div className="saved-flowcharts flex">
        {/* Mapping through fetched flowcharts */}
        {flowcharts.map((flowchart) => (
          <div key={flowchart._id} className="flowchart-item mb-2">
            <Link to={`/flowchart/${flowchart._id}`}>{flowchart.name}</Link>{" "}
            {/* Link to each flowchart */}
          </div>
        ))}
      </div>

      <div className="sidebar-buttons">
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out {/* Button to sign out */}
        </button>
        <button
          onClick={handleCreateNewFlowchart}
          className="create-new-flowchart-button"
        >
          + {/* Button to create a new flowchart */}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
