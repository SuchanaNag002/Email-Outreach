import React, { useState, useEffect } from "react";
import { Handle, Position } from "reactflow";
import { FaTimes } from "react-icons/fa";
import "../../styles/Nodes.css";

function LeadNode({ id, data }) {
  // Initialize state for emails
  const [emails, setEmails] = useState(data.emails || [""]);

  // Update data when emails change
  useEffect(() => {
    if (data.onChange) {
      data.onChange({ ...data, emails });
    }
  }, [emails, data]);

  // Handle changes in email input fields
  const handleEmailChange = (index, value) => {
    const newEmails = [...emails];
    newEmails[index] = value;
    setEmails(newEmails);
  };

  // Handle deletion of the node
  const handleDelete = () => {
    if (data.onDelete) {
      data.onDelete(id);
    }
  };

  // Handle "Enter" key press to add a new email input
  const handleKeyDown = (index, event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const newEmails = [...emails, ""];
      setEmails(newEmails);
    }
  };

  // Add a new empty email input
  const handleAddEmail = () => {
    setEmails([...emails, ""]);
  };

  // Remove an email input by index
  const handleRemoveEmail = (index) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
  };

  return (
    <div className="lead-node-container">
      {/* Bottom handle for outgoing connections */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="lead-node-handle"
      />
      {/* Delete button for the node */}
      <button
        className="lead-node-delete"
        onClick={handleDelete}
        aria-label="Delete node"
      >
        <FaTimes size={16} />
      </button>
      <h3 className="lead-node-title">Lead Node</h3>
      <div className="lead-node-emails">
        {emails.map((email, index) => (
          <div key={index} className="lead-node-email-input-container">
            <input
              type="email"
              placeholder="Recipient Email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="lead-node-input"
            />
            {emails.length > 1 && (
              <button
                onClick={() => handleRemoveEmail(index)}
                className="lead-node-remove-email"
                aria-label="Remove email"
              >
                <FaTimes size={12} />
              </button>
            )}
          </div>
        ))}
        {/* Button to add a new email input */}
        <button onClick={handleAddEmail} className="lead-node-add-email">
          Add Email
        </button>
      </div>
    </div>
  );
}

export default LeadNode;
