import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { FaTimes } from "react-icons/fa";
import "../../styles/Nodes.css";

function WaitNode({ data, id }) {
  // Initialize state for duration and unit
  const [duration, setDuration] = useState(data.duration || "");
  const [unit, setUnit] = useState(data.unit || "minutes");

  // Update data when duration or unit changes
  useEffect(() => {
    if (data.onChange) {
      data.onChange({ ...data, duration, unit });
    }
  }, [data, duration, unit]);

  // Handle changes in the duration input field
  const handleDurationChange = (evt) => {
    setDuration(evt.target.value);
  };

  // Handle changes in the unit dropdown
  const handleUnitChange = (evt) => {
    setUnit(evt.target.value);
  };

  // Handle deletion of the node
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="wait-node-container">
      {/* Delete button for the node */}
      <button
        className="wait-node-delete"
        onClick={handleDelete}
        aria-label="Delete node"
      >
        <FaTimes size={16} />
      </button>

      {/* Top handle for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="wait-node-handle"
      />
      <h3 className="wait-node-title">Wait Node</h3>

      {/* Input for wait duration */}
      <input
        type="number"
        value={duration}
        onChange={handleDurationChange}
        className="wait-node-input"
        placeholder="Duration"
      />

      {/* Dropdown to select the unit of time */}
      <select
        value={unit}
        onChange={handleUnitChange}
        className="wait-node-select"
      >
        <option value="minutes">Minutes</option>
        <option value="hours">Hours</option>
        <option value="days">Days</option>
      </select>

      {/* Bottom handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="wait-node-handle"
      />
    </div>
  );
}

export default WaitNode;
