import { cn } from "@/lib/utils";
import { Route } from "@/routes/__root";
import { Link, useLocation, useRouter } from "@tanstack/react-router";
import { Menu, ShoppingCart, User } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Avatar, AvatarFallback } from "./ui/avatar";

export default function Navbar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const user = Route.useRouteContext().user;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "About", to: "/about" },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <nav className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-primary cursor-pointer">
          <Link to="/">Watches</Link>
        </h1>

        {/* Desktop links */}
        <div className="hidden md:flex space-x-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "text-muted-foreground hover:text-primary text-md font-semibold transition-colors",
                isActive(link.to) && "text-primary underline underline-offset-4 font-bold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-2">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost">
                  <Menu strokeWidth={3} size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-64">
                <SheetHeader>
                  <SheetTitle className="text-lg font-bold tracking-wide">Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-2 mt-4">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className={cn(
                        "text-muted-foreground px-3 py-2 text-md font-semibold",
                        isActive(link.to) && "text-primary bg-accent"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Separator />
                  {user ? (
                    <>
                      <Link
                        to="/profile"
                        className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-md font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Separator />

                      <Link
                        to="/logout"
                        className="text-destructive px-3 py-2 rounded-md text-md font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Logout
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="text-primary px-3 py-2 rounded-md text-md font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Cart */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <ShoppingCart strokeWidth={3} size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Your Cart</SheetTitle>
              </SheetHeader>
              <p className="text-sm text-muted-foreground mt-2">Cart is currently empty.</p>
            </SheetContent>
          </Sheet>

          {/* User dropdown */}
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild onPointerDown={(e) => e.preventDefault()}>
              {user ? (
                <Avatar
                  onClick={() => (user ? setOpen(!open) : router.navigate({ to: "/login" }))}
                  className="cursor-pointer"
                >
                  <AvatarFallback>{user.email.slice(0, 1)}</AvatarFallback>
                </Avatar>
              ) : (
                <Button
                  variant="ghost"
                  className="hidden md:flex"
                  onClick={() => (user ? setOpen(!open) : router.navigate({ to: "/login" }))}
                >
                  <User strokeWidth={3} size={24} />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {user && (
                <>
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/logout">Logout</Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
