import React, { useState, useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  Position,
  addEdge,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { FaTimesCircle } from "react-icons/fa";
import DeleteEdge from "../components/DeleteEdge";

// ===================================
// Excel Node
// ===================================

function ExcelNode({ data }) {
  return (
    <div
      style={{
        width: 180,
        padding: 12,
        border: "2px solid #2563eb",
        borderRadius: 8,
        background: "#dbeafe",
        textAlign: "center",
        fontWeight: "bold",
        position: "relative",
      }}
    >
      {data.label}

      <Handle
        type="source"
        position={Position.Right}
        style={{
          width: 12,
          height: 12,
          background: "#2563eb",
          border: "2px solid white",
        }}
      />
    </div>
  );
}

// ===================================
// Warehouse Node
// ===================================

function WarehouseNode({ data }) {
  return (
    <div
      style={{
        width: 180,
        padding: 12,
        border: "2px solid #16a34a",
        borderRadius: 8,
        background: "#dcfce7",
        textAlign: "center",
        fontWeight: "bold",
        position: "relative",
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        style={{
          width: 12,
          height: 12,
          background: "#16a34a",
          border: "2px solid white",
        }}
      />

      {data.label}
    </div>
  );
}

// ===================================
// Node Types
// ===================================

const nodeTypes = {
  excel: ExcelNode,
  warehouse: WarehouseNode,
};

// ===================================
// Data
// ===================================

const excelColumns = [
  "Product Name",
  "Product Code",
  "Qty",
  "Price",
  "Vendor",
  "Warehouse",
];

const warehouseFields = [
  "Name",
  "SKU",
  "Quantity",
  "Price",
  "Supplier",
  "Location",
];

// ===================================
// Nodes
// ===================================

const initialNodes = [
  ...excelColumns.map((column, index) => ({
    id: `excel-${index}`,
    type: "excel",
    position: {
      x: 100,
      y: index * 110 + 40,
    },
    data: {
      label: column,
    },
  })),

  ...warehouseFields.map((field, index) => ({
    id: `warehouse-${index}`,
    type: "warehouse",
    position: {
      x: 600,
      y: index * 110 + 40,
    },
    data: {
      label: field,
    },
  })),
];

const edgeTypes = {
  deleteEdge: DeleteEdge,
};

// ===================================
// Component
// ===================================

export default function MappingPage() {
  const [edges, setEdges] = useState([]);

  const onConnect = useCallback((connection) => {
  setEdges((edges) =>
    addEdge(
      {
        ...connection,
        type: "deleteEdge",
        animated: true,
        data: {
          onDelete: (id) => {
            setEdges((current) =>
              current.filter((edge) => edge.id !== id)
            );
          },
        },
      },
      edges
    )
  );
}, []);

  const onEdgesDelete = useCallback((deletedEdges) => {
    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) => !deletedEdges.some((d) => d.id === edge.id)
      )
    );
  }, []);

  const clearMappings = () => {
    setEdges([]);
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        style={{
          padding: 15,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ddd",
        }}
      >
        <h2>WarehouseSync - Manual Field Mapping</h2>

        <button
          onClick={clearMappings}
          style={{
            padding: "10px 18px",
            cursor: "pointer",
          }}
        >
          Clear All Mappings
        </button>
      </div>

      <div style={{ width: "100%", height: "92%" }}>
        <ReactFlow
        nodes={initialNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        fitView
        nodesDraggable={false}
        nodesConnectable={true}
        elementsSelectable={true}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}