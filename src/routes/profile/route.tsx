import { cn } from "@/lib/utils";
import { createFileRoute, Link, Outlet, useRouter } from "@tanstack/react-router";
import { MapPinned, Settings, ShoppingCart, User } from "lucide-react";

export const Route = createFileRoute("/profile")({
  component: RouteComponent,
});

const links = [
  { label: "General", to: "/profile/general", icon: User },
  { label: "Address", to: "/profile/address", icon: MapPinned },
  { label: "Settings", to: "/profile/settings", icon: Settings },
  { label: "Orders", to: "/profile/orders", icon: ShoppingCart },
];

function RouteComponent() {
  const user = Route.useRouteContext().user;
  const router = useRouter();

  return (
    <>
      {/* Sidebar */}
      <div className="flex flex-1">
        <aside className="min-w-96 border-r bg-muted/40">
          <h2 className="p-4 font-semibold text-lg">Hello {user?.fullName}!</h2>
          {/* Links */}
          <nav className="flex flex-col gap-2 p-4">
            {links.map((item) => {
              const isActive = router.state.location.pathname === item.to;
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-4 transition-colors hover:bg-muted px-3 py-2 rounded-md",
                    isActive && "bg-muted font-semibold"
                  )}
                >
                  <Icon />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <Outlet />
      </div>
    </>
  );
}
