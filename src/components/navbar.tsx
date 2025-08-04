import { cn } from "@/lib/utils";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary">Watches</h1>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                to="/"
                className={cn(
                  "text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/") && "text-primary"
                )}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={cn(
                  "text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/products") && "text-primary"
                )}
              >
                Products
              </Link>
              <Link
                to="/about"
                className={cn(
                  "text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive("/about") && "text-primary"
                )}
              >
                About
              </Link>
              <ShoppingCart size={20} strokeWidth={3} className="ml-10" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
