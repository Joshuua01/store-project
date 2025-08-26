import { getSupabaseServerClient } from "@/utils/supabase";
import { redirect } from "@tanstack/react-router";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/auth/callback" as never).methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");

    if (code) {
      const supabase = getSupabaseServerClient();
      const result = await supabase.auth.exchangeCodeForSession(code);
    }
    throw redirect({
      href: "/",
    });
  },
});
