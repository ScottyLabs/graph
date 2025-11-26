import { createFileRoute } from "@tanstack/react-router";
import Graph from "@/components/Graph";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return <Graph />;
}
