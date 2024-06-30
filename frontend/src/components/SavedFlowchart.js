import React, { useState, useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import ReactFlow, {
  Background,
  Controls,
  applyEdgeChanges,
  applyNodeChanges,
} from "reactflow";
import "reactflow/dist/style.css";

import { getFlowchart } from "../services/api";
import LeadNode from "./nodes/LeadNode";
import WaitNode from "./nodes/WaitNode";
import EmailNode from "./nodes/EmailNode";

// Define custom node types
const nodeTypes = {
  lead: LeadNode,
  wait: WaitNode,
  email: EmailNode,
};

const SavedFlowchart = () => {
  const { id } = useParams();
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [flowchartName, setFlowchartName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch flowchart data on component mount
  useEffect(() => {
    const fetchFlowchart = async () => {
      try {
        const flowchart = await getFlowchart(id);
        console.log("Fetched flowchart:", flowchart);
        setFlowchartName(flowchart.name);

        if (!flowchart.nodes || !Array.isArray(flowchart.nodes)) {
          throw new Error("Invalid nodes data");
        }

        // Process nodes data
        const processedNodes = flowchart.nodes.map((node) => ({
          id: node._id,
          type: node.type,
          position: node.position,
          data: {
            ...node.data,
            isReadOnly: true,
          },
        }));

        console.log("Processed nodes:", processedNodes);
        setNodes(processedNodes);

        // Process edges data
        const processedEdges = flowchart.edges.map((edge) => ({
          id: edge._id,
          source: edge.source,
          target: edge.target,
        }));

        console.log("Processed edges:", processedEdges);
        setEdges(processedEdges);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching flowchart:", err);
        setError("Failed to load flowchart: " + err.message);
        setLoading(false);
      }
    };

    fetchFlowchart();
  }, [id]);

  // Handle node changes
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handle edge changes
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Display loading or error message
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4">{flowchartName}</h2>
      <div className="flex-grow" style={{ height: "calc(100vh - 100px)" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          zoomOnScroll={false}
          panOnScroll={true}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};

export default SavedFlowchart;
