import type { BaseGraphNode, GraphEdge } from "@/types/graph";

/**
 * Calculate BFS distances between nodes starting from the selected node
 */
export const computeDistances = (
  selectedId: string,
  nodes: BaseGraphNode[],
  edges: GraphEdge[],
): Map<string, number> => {
  const adjacency = new Map<string, Set<string>>();
  for (const n of nodes) {
    adjacency.set(n.id, new Set());
  }

  edges.forEach((e) => {
    adjacency.get(e.from)?.add(e.to);
    adjacency.get(e.to)?.add(e.from);
  });

  const distances = new Map<string, number>();
  const queue: [string, number][] = [[selectedId, 0]];

  while (queue.length) {
    const [id, d] = queue.shift()!;
    if (distances.has(id)) continue;
    distances.set(id, d);
    for (const neighbor of adjacency.get(id) ?? []) {
      queue.push([neighbor, d + 1]);
    }
  }

  return distances;
};
