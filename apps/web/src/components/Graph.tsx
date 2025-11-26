import { Canvas } from "@react-three/fiber";
import { useMemo, useState } from "react";
import CameraControls from "@/components/CameraControls";
import GraphEdgeDisplay from "@/components/GraphEdgeDisplay";
import GraphNodeDisplay from "@/components/GraphNodeDisplay";
import { edges, nodes } from "@/data/graph";
import type { PositionedGraphNode } from "@/types/graph";
import { computeDistances } from "@/utils/dist";
import { computeDomeLayout } from "@/utils/layout";

const Graph = () => {
  const [selectedId, setSelectedId] = useState("yh4");

  // Compute BFS distances and layout
  const distances = useMemo(
    () => computeDistances(selectedId, nodes, edges),
    [selectedId],
  );
  const layout = useMemo(
    () => computeDomeLayout(selectedId, nodes, edges),
    [selectedId],
  );

  // Add positions to nodes
  const positionedNodes: PositionedGraphNode[] = useMemo(
    () => nodes.map((n) => ({ ...n, position: layout[n.id] || [0, 0, 0] })),
    [layout],
  );

  const getPos = (id: string): [number, number, number] =>
    layout[id] || [0, 0, 0];
  const selectedNode = positionedNodes.find((n) => n.id === selectedId);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Info UI */}
      <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
        <div className="bg-slate-800/90 backdrop-blur-md rounded-lg px-4 py-3 border border-slate-700">
          <p className="text-slate-300 text-xs">
            🖱️ Click node to refocus | Drag to rotate | 🔍 Scroll to zoom
          </p>
        </div>
      </div>

      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <pointLight position={[-10, -10, -10]} />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={0.7}
        />

        {/* Edges with label + fading */}
        {edges.map((edge) => {
          const fromDist = distances.get(edge.from) ?? Infinity;
          const toDist = distances.get(edge.to) ?? Infinity;

          // Edge "depth" relative to selected node
          const maxDist = Math.max(fromDist, toDist);

          // Only show labels if both nodes are in the same layer
          const showLabel = edge.from === selectedId || edge.to === selectedId;

          // Compute fade → closer = 1.0, far = ~0.15
          const opacity =
            maxDist === Infinity ? 0.05 : Math.max(0.15, 1 - maxDist * 0.3);

          return (
            <GraphEdgeDisplay
              key={`${edge.from}-${edge.to}`}
              from={getPos(edge.from)}
              to={getPos(edge.to)}
              label={showLabel ? edge.label : undefined}
              opacity={opacity}
            />
          );
        })}

        {/* Nodes */}
        {positionedNodes.map((node) => {
          const distance = distances.get(node.id) ?? Infinity;
          return (
            <GraphNodeDisplay
              key={node.id}
              node={node}
              distance={distance}
              isSelected={selectedId === node.id}
              onClick={() => setSelectedId(node.id)}
            />
          );
        })}

        {/* Smooth camera focus */}
        <CameraControls targetPosition={selectedNode?.position ?? [0, 0, 0]} />
      </Canvas>
    </div>
  );
};

export default Graph;
