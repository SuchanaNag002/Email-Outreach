import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { FaTimes } from "react-icons/fa";
import "../../styles/Nodes.css";

function EmailNode({ id, data }) {
  // Initialize state for subject and body
  const [subject, setSubject] = useState(data.subject || "");
  const [body, setBody] = useState(data.body || "");

  // Update data when subject or body changes
  useEffect(() => {
    if (data.onChange) {
      data.onChange({ ...data, subject, body });
    }
  }, [data, subject, body]);

  // Handle changes in the subject input field
  const handleSubjectChange = (evt) => {
    setSubject(evt.target.value);
  };

  // Handle changes in the body textarea
  const handleBodyChange = (evt) => {
    setBody(evt.target.value);
  };

  // Handle deletion of the node
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  return (
    <div className="email-node-container">
      {/* Top handle for incoming connections */}
      <Handle
        type="target"
        position={Position.Top}
        className="email-node-handle"
      />

      {/* Delete button for the node */}
      <button
        className="email-node-delete"
        onClick={handleDelete}
        aria-label="Delete node"
      >
        <FaTimes size={16} />
      </button>

      <div>
        <h3 className="email-node-title">Email Node</h3>
        {/* Input for email subject */}
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={handleSubjectChange}
          className="email-node-input"
        />
        {/* Textarea for email body */}
        <textarea
          placeholder="Email Body"
          value={body}
          onChange={handleBodyChange}
          className="email-node-textarea"
          rows="3"
        />
      </div>

      {/* Bottom handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="email-node-handle"
      />
    </div>
  );
}

export default EmailNode;
