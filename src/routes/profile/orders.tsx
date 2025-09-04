import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/profile/orders")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/profile/orders"!</div>;
}
