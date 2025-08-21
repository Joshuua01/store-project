import { getSupabaseServerClient } from "@/utils/supabase";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const logoutFn = createServerFn({ method: "POST" }).handler(async ({ data }) => {
  const supabase = getSupabaseServerClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  throw redirect({
    href: "/",
  });
});

export const Route = createFileRoute("/logout")({
  preload: false,
  loader: () => logoutFn(),
});
