import { Line, Text } from "@react-three/drei";

interface GraphEdgeDisplayProps {
  from: [number, number, number];
  to: [number, number, number];
  label?: string;
  opacity?: number;
}

/**
 * Displays a line between two 3D positions, optionally with a label at the midpoint.
 */
const GraphEdgeDisplay = ({
  from,
  to,
  label,
  opacity = 0.6,
}: GraphEdgeDisplayProps) => {
  const midPoint: [number, number, number] = [
    (from[0] + to[0]) / 2,
    (from[1] + to[1]) / 2,
    (from[2] + to[2]) / 2,
  ];

  return (
    <group>
      <Line
        points={[from, to]}
        color="#94a3b8"
        opacity={opacity}
        transparent
        lineWidth={1.5}
      />
      {label && (
        <Text
          position={midPoint}
          fontSize={0.25}
          color="#e2e8f0"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.015}
          outlineColor="black"
          renderOrder={10}
        >
          {label}
        </Text>
      )}
    </group>
  );
};

export default GraphEdgeDisplay;
