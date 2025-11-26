import type { BaseGraphNode, GraphEdge } from "@/types/graph";

export const computeDomeLayout = (
	selectedId: string,
	nodes: BaseGraphNode[],
	edges: GraphEdge[],
): Record<string, [number, number, number]> => {
	// Build adjacency list
	const adjacency = new Map<string, Set<string>>();
	nodes.forEach((n) => adjacency.set(n.id, new Set()));
	edges.forEach((e) => {
		adjacency.get(e.from)?.add(e.to);
		adjacency.get(e.to)?.add(e.from);
	});

	// BFS distance from selected node
	const distances = new Map<string, number>();
	const q: [string, number][] = [[selectedId, 0]];
	while (q.length) {
		const [id, d] = q.shift()!;
		if (distances.has(id)) continue;
		distances.set(id, d);
		for (const n of adjacency.get(id) ?? []) q.push([n, d + 1]);
	}

	// Group by distance
	const byDist: Record<number, string[]> = {};
	for (const [id, d] of distances) {
		if (!byDist[d]) byDist[d] = [];
		byDist[d].push(id);
	}

	const layout: Record<string, [number, number, number]> = {};
	const layerRadius = 3; // distance between rings

	layout[selectedId] = [0, 0, 0]; // center

	Object.entries(byDist).forEach(([distStr, ids]) => {
		const dist = +distStr;
		if (dist === 0) return;
		const step = (2 * Math.PI) / ids.length;
		const r = dist * layerRadius;
		const z = -dist; // deeper into screen
		ids.forEach((id, i) => {
			const angle = i * step;
			const x = Math.cos(angle) * r;
			const y = Math.sin(angle) * r;
			layout[id] = [x, y, z];
		});
	});

	return layout;
};
