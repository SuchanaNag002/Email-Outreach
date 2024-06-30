import React, { useState, useCallback, useRef } from "react";
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import { createFlowchart } from "../services/api";
import "../styles/Flowchart.css";

import LeadNode from "./nodes/LeadNode";
import WaitNode from "./nodes/WaitNode";
import EmailNode from "./nodes/EmailNode";

// Define custom node types
const nodeTypes = {
  lead: LeadNode,
  wait: WaitNode,
  email: EmailNode,
};

const FlowchartComponent = () => {
  // State for nodes, edges, and flowchart name
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [flowchartName, setFlowchartName] = useState("");
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Update node data when a node changes
  const onNodeChange = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...newData } }
            : node
        )
      );
    },
    [setNodes]
  );

  // Delete a node and its associated edges
  const onDeleteNode = useCallback(
    (id) => {
      setNodes((nds) => nds.filter((node) => node.id !== id));
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== id && edge.target !== id)
      );
    },
    [setNodes, setEdges]
  );

  // Handle drag over event
  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle node drop event
  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      if (!reactFlowInstance || !reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Initialize node data based on the type
      let nodeData = {
        label: `${type} node`,
        onDelete: onDeleteNode,
        onChange: (newData) => onNodeChange(newNode.id, newData),
      };

      // Set additional data properties for specific node types
      switch (type) {
        case "lead":
          nodeData.emails = [""];
          break;
        case "wait":
          nodeData.duration = "";
          nodeData.unit = "minutes";
          break;
        case "email":
          nodeData.subject = "";
          nodeData.body = "";
          break;
        default:
          break;
      }

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: nodeData,
      };

      // Add the new node to the state
      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes, onDeleteNode, onNodeChange]
  );

  // Handle flowchart saving
  const handleSave = async () => {
    if (!flowchartName) {
      alert("Please enter a flowchart name");
      return;
    }

    const flowchartData = {
      name: flowchartName,
      nodes: nodes.map(({ id, type, position, data }) => ({
        id,
        type,
        position,
        data: {
          ...data,
          onDelete: undefined,
          onChange: undefined,
        },
      })),
      edges,
    };

    try {
      await createFlowchart(flowchartData);
      alert("Flowchart saved successfully!");
      setFlowchartName("");
    } catch (error) {
      console.error("Error saving flowchart:", error);
      alert("Failed to save flowchart");
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Input for flowchart name and save button */}
      <div className="mb-4 flex">
        <input
          type="text"
          value={flowchartName}
          onChange={(e) => setFlowchartName(e.target.value)}
          placeholder="Flowchart Name"
          className="p-2 border rounded flex-grow mr-2"
        />
        <button
          onClick={handleSave}
          className="save-button px-4 py-2 hover:bg-blue-600"
        >
          Save Flowchart
        </button>
      </div>
      <div
        className="flex-grow z-10"
        style={{ height: "calc(100vh - 60px)", width: "100%" }}
        ref={reactFlowWrapper}
      >
        {/* ReactFlow component for displaying the flowchart */}
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDragOver={onDragOver}
            onDrop={onDrop}
            nodeTypes={nodeTypes}
            fitView
          >
            <Controls />
            <Background />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
};

export default FlowchartComponent;
