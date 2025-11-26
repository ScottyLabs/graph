export interface BaseGraphNode {
  id: string;
  name: string;
}

export interface PositionedGraphNode extends BaseGraphNode {
  position: [number, number, number];
}

export interface GraphEdge {
  from: string;
  to: string;
  label?: string;
}
