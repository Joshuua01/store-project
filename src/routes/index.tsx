import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div className="min-h-screen bg-[url('/landing.png')] bg-cover bg-center flex flex-col items-end justify-center">
      <div className="flex lg:items-end justify-center mr-[15%] flex-col text-center w-1/3 items-center lg:text-right">
        <h1 className="text-4xl font-bold text-primary/80">Welcome to Our Watch Store</h1>
        <p className="text-lg text-muted-foreground mt-5">
          Discover the finest collection of watches crafted with precision and style.
        </p>
        <p className="text-lg text-muted-foreground mt-2">
          Explore our range of luxury timepieces that blend elegance with functionality.
        </p>
        <p className="text-lg text-muted-foreground mt-2">
          Whether you're looking for a classic design or a modern statement piece, we have something for everyone.
        </p>
        <Button className="bg-primary/80 cursor-pointer mt-8" variant={"default"}>
          Browse products &gt;
        </Button>
      </div>
    </div>
  );
}
