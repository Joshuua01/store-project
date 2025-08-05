import { cn } from "@/lib/utils";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { ShoppingCart, User } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-transparent w-full flex justify-center items-center">
      <nav className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 w-4/5">
        <h1 className="text-3xl font-bold text-primary cursor-pointer">
          <Link to="/">Watches</Link>
        </h1>
        <div className="hidden md:block">
          <Link
            to="/"
            className={cn(
              "text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-all",
              isActive("/") && "text-primary underline underline-offset-4"
            )}
          >
            Home
          </Link>
          <Link
            to="/products"
            className={cn(
              "text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors",
              isActive("/products") && "text-primary underline underline-offset-4"
            )}
          >
            Products
          </Link>
          <Link
            to="/about"
            className={cn(
              "text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-md font-medium transition-colors",
              isActive("/about") && "text-primary underline underline-offset-4"
            )}
          >
            About
          </Link>
        </div>
        <div className="hidden md:flex justify-center items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant={"ghost"} asChild>
                <ShoppingCart strokeWidth={3} size={24} className="w-13 h-13" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>
                  <h2 className="text-lg font-bold">Your Cart</h2>
                </SheetTitle>
                <SheetDescription>
                  <p className="text-sm text-muted-foreground">Cart is currently empty.</p>
                </SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Button variant={"ghost"} asChild>
            <User strokeWidth={3} size={24} className="w-13 h-13" />
          </Button>
        </div>
      </nav>
    </header>
  );
}
