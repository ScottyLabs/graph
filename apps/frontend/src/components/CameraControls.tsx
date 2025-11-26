import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface Props {
	/** node position [x, y, z] to focus on */
	targetPosition: [number, number, number] | null;
}

/**
 * OrbitControls wrapper
 *  - Smoothly focus on target node
 *  - Keeps minimal safe camera distance
 */
const CameraControls = ({ targetPosition }: Props) => {
	const controlsRef = useRef<OrbitControlsImpl>(null);
	const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
	const desiredPos = useRef(new THREE.Vector3(0, 0, 10));

	// constants for spacing
	const baseDistance = 10; // typical viewing distance
	const minFocusDistance = 5; // don't let camera get closer than this
	const transitionSpeed = 0.05; // how fast to lerp

	useEffect(() => {
		if (targetPosition) {
			const newTarget = new THREE.Vector3(...targetPosition);
			currentTarget.current.copy(newTarget);

			// calculate safe camera distance adaptively based on target Z depth
			const safeDistance = Math.max(
				minFocusDistance,
				baseDistance - newTarget.z * 0.5,
			);

			// offset camera direction so it stays behind the target
			desiredPos.current.set(
				newTarget.x,
				newTarget.y + 1.5, // slight upward tilt
				newTarget.z + safeDistance,
			);
		}
	}, [targetPosition]);

	useFrame(({ camera }) => {
		const controls = controlsRef.current;
		if (!controls) return;

		// Smoothly interpolate camera toward desired position
		camera.position.lerp(desiredPos.current, transitionSpeed);

		// Smoothly interpolate controls' target
		controls.target.lerp(currentTarget.current, 0.1);

		controls.update();
	});

	return (
		<OrbitControls
			ref={controlsRef}
			enablePan={false}
			enableDamping
			dampingFactor={0.05}
			minDistance={minFocusDistance}
			maxDistance={25}
			zoomSpeed={0.6}
			rotateSpeed={0.9}
		/>
	);
};

export default CameraControls;
