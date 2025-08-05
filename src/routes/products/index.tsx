import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/products/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div className="flex-1 bg-gradient-to-br from-gray-300 to-stone-300"></div>;
}
