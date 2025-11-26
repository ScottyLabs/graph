// src/data/nodes.ts
import type { BaseGraphNode, GraphEdge } from "@/types/graph";

export const nodes: BaseGraphNode[] = [
	{ id: "yh4", name: "Yuxiang" },

	// Data TEam
	{ id: "ellysel", name: "Ellyse" },
	{ id: "yiyuc", name: "Romy" },
	{ id: "rzhu3", name: "Richard" },
	{ id: "jessec2", name: "Jesse" },
	{ id: "cheyut", name: "Cheyu" },
	{ id: "krishsha", name: "Krish" },
	{ id: "sayevikk", name: "Saye" },

	// Frontend Team
	{ id: "lhann", name: "Luke" },
	{ id: "samuell2", name: "Samuel" },
	{ id: "mcnairs", name: "BucketOfJava" },

	// Design Team
	{ id: "pboonsit>", name: "Wunwan" },
	{ id: "kgeng2", name: "Katherine" },
	{ id: "zhihanc", name: "Jessica" },

	// Backend Team
	{ id: "jettc", name: "Jett" },
];

export const edges: GraphEdge[] = [
	// Leads
	{ from: "yh4", to: "ellysel", label: "Data Lead" },
	{ from: "yh4", to: "yiyuc", label: "Data Lead" },
	{ from: "yh4", to: "lhann", label: "Frontend Lead" },
	{ from: "yh4", to: "pboonsit>", label: "Design Lead" },

	// Special
	{ from: "yh4", to: "rzhu3", label: "Rev Noodle Supplier" },
	{ from: "yh4", to: "jettc", label: "Backend Developer" },

	// Data Team
	{ from: "yiyuc", to: "ellysel", label: "Data Co-Lead" },
	{ from: "yiyuc", to: "jessec2", label: "Data Member" },
	{ from: "yiyuc", to: "cheyut", label: "Data Member" },
	{ from: "yiyuc", to: "krishsha", label: "Data Member" },
	{ from: "yiyuc", to: "sayevikk", label: "Data Member" },
	{ from: "yiyuc", to: "rzhu3", label: "Data Member" },
	{ from: "ellysel", to: "jessec2", label: "Data Member" },
	{ from: "ellysel", to: "cheyut", label: "Data Member" },
	{ from: "ellysel", to: "krishsha", label: "Data Member" },
	{ from: "ellysel", to: "sayevikk", label: "Data Member" },
	{ from: "ellysel", to: "rzhu3", label: "Data Member" },

	// Frontend Team
	{ from: "lhann", to: "samuell2", label: "Frontend Member" },
	{ from: "lhann", to: "mcnairs", label: "Frontend Member" },

	// Design Team
	{ from: "pboonsit>", to: "kgeng2", label: "Design Member" },
	{ from: "pboonsit>", to: "zhihanc", label: "Design Member" },
];
