import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseServerClient } from "@/utils/supabase";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/general")({
  component: RouteComponent,
});

const updateUserFn = createServerFn({ method: "POST" })
  .validator((d: ProfileForm) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: data.fullName,
        phone: data.phone,
      },
      email: data.email,
    });

    if (error) {
      throw new Error(error.message);
    }
  });

interface ProfileForm {
  fullName: string;
  email: string;
  phone: string;
}

function RouteComponent() {
  const user = Route.useRouteContext().user;
  const provider = user?.provider || "";
  const router = useRouter();

  const defaultValues: ProfileForm = {
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      try {
        await updateUserFn({ data: values.value });
        toast.success("Profile updated successfully");
        router.invalidate();
      } catch (error) {
        toast.error("Failed to update profile");
      }
    },
  });

  return (
    <div className="flex flex-1 p-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="flex flex-col gap-3 w-1/2"
      >
        <form.Field
          name="fullName"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A full name is required"
                : value.length < 5
                  ? "Full name must be at least 5 characters"
                  : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Full Name</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                autoComplete="name"
              />
              <div className="text-destructive text-sm min-h-5">
                {field.state.meta.errors.map((err) => (
                  <div key={err}>{err}</div>
                ))}
              </div>
            </>
          )}
        </form.Field>
        <form.Field
          name="email"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "An email is required"
                : !/\S+@\S+\.\S+/.test(value)
                  ? "Email must be a valid email address"
                  : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Email</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="email"
                autoComplete="email"
                disabled={provider !== "email"}
              />
              <div className="text-destructive text-sm min-h-5">
                {field.state.meta.errors.map((err) => (
                  <div key={err}>{err}</div>
                ))}
              </div>
            </>
          )}
        </form.Field>
        <form.Field
          name="phone"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A phone number is required"
                : !/^\+?[1-9]\d{1,14}$/.test(value)
                  ? "Phone number must be a valid international phone number"
                  : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Phone</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="tel"
                autoComplete="tel"
              />
              <div className="text-destructive text-sm min-h-5">
                {field.state.meta.errors.map((err) => (
                  <div key={err}>{err}</div>
                ))}
              </div>
            </>
          )}
        </form.Field>
        <form.Subscribe selector={(state) => [state.isDefaultValue, state.canSubmit, state.isSubmitting]}>
          {([isDefaultValue, canSubmit, isSubmitting]) => (
            <Button type="submit" disabled={isDefaultValue || isSubmitting || !canSubmit} className="mt-6">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </form.Subscribe>
      </form>
    </div>
  );
}
