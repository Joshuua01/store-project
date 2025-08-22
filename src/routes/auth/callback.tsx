import { getSupabaseServerClient } from "@/utils/supabase";
import { createServerClient } from "@supabase/ssr";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

// export const oAuthCallbackFn = createServerFn({ method: "GET" })
//   .validator((data: string) => data)
//   .handler(async (ctx) => {
//     if (ctx.data) {
//       const supabase = getSupabaseServerClient();
//       const result = await supabase.auth.exchangeCodeForSession(ctx.data);
//       console.log("OAuth Callback Result:", result);
//     }
//   });

export const Route = createFileRoute("/auth/callback")({
  loader: async ({ location }) => {
    console.log("maybe");
    if (location.search.code) {
      const supabase = getSupabaseServerClient();
      //   await supabase.auth.exchangeCodeForSession(location.search.code);
    }
  },
});
