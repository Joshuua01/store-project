import { Button } from "@/components/ui/button";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      <div className="flex justify-center flex-row text-center w-4/5 items-center lg:text-right">
        <div className="flex-1">
          <img src="/watch.png" alt="Watch" />
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-primary">Welcome to Our Watch Store</h1>
          <p className="text-lg text-muted-foreground mt-5">
            Discover the finest collection of watches crafted with precision and style.
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Explore our range of luxury timepieces that blend elegance with functionality.
          </p>
          <p className="text-lg text-muted-foreground mt-2">
            Whether you're looking for a classic design or a modern statement piece, we have something for everyone.
          </p>
          <Button className="bg-primary cursor-pointer mt-8" variant={"default"} size={"lg"}>
            <Link to="/products">Browse products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
