import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import type { PositionedGraphNode } from "@/types/graph";

interface Props {
  node: PositionedGraphNode;
  isSelected: boolean;
  onClick: () => void;
  distance?: number;
}

const GraphNodeDisplay = ({
  node,
  isSelected,
  onClick,
  distance = 0,
}: Props) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [texture, _setTexture] = useState<THREE.Texture>();

  // useEffect(() => {
  // 	const loader = new THREE.TextureLoader();
  // 	loader.load(node.image, setTexture);
  // }, [node.image]);

  useFrame((state) => {
    // Smooth movement toward its target position
    if (groupRef.current) {
      groupRef.current.position.lerp(new THREE.Vector3(...node.position), 0.15);
    }

    // Animate rotation ring
    if (ringRef.current && isSelected) {
      ringRef.current.rotation.z = state.clock.elapsedTime * 2;
    }

    // Animate node scaling (pulse)
    if (meshRef.current) {
      const targetScale = isSelected
        ? 1.2 + Math.sin(state.clock.elapsedTime * 3) * 0.05
        : hovered
          ? 1.1
          : 1;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1,
      );
    }
  });

  // Compute transparency based on depth and distance
  const zDepthOpacity = Math.max(0.3, 1 - Math.abs(node.position[2]) * 0.25);
  const distOpacity =
    distance === 0 ? 1 : distance === 1 ? 0.8 : distance === 2 ? 0.5 : 0.25;
  const finalOpacity = Math.max(0.1, zDepthOpacity * distOpacity);

  // Color glow reduces with distance
  const emissiveColor = isSelected
    ? "#f6ad55" // gold
    : distance === 1
      ? "#63b3ed" // bright blue
      : distance === 2
        ? "#3b82f6" // mid blue
        : "#1e3a8a"; // dim blue

  // Base radius
  const sphereRadius = 0.5;
  const textOffsetY = sphereRadius * 2.2; // how far above node label sits

  return (
    <group ref={groupRef}>
      {/* Sphere Node */}
      {/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[sphereRadius, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          emissive={emissiveColor}
          emissiveIntensity={isSelected ? 0.6 : hovered ? 0.4 : 0.25}
          transparent
          opacity={finalOpacity}
        />
      </mesh>

      {/* Always‑facing label */}
      <Html
        position={[0, textOffsetY, 0]} // dynamically above sphere
        distanceFactor={8}
        center
        occlude
        transform
      >
        <div className="pointer-events-none">
          <div
            className={`px-3 py-1 rounded-lg border text-sm font-medium whitespace-nowrap select-none ${
              distance > 2
                ? "bg-slate-700/20 border-slate-600/20 text-slate-500"
                : "bg-slate-800/80 border-slate-600 text-white"
            }`}
          >
            {node.name}
          </div>
        </div>
      </Html>
    </group>
  );
};

export default GraphNodeDisplay;
