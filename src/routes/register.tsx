import SocialLogins from "@/components/social-logins";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { getSupabaseServiceClient } from "@/utils/supabase";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

interface RegisterForm {
  email: string;
  password: string;
  repeatPassword: string;
}

const defaultRegister: RegisterForm = {
  email: "",
  password: "",
  repeatPassword: "",
};

const registerFn = createServerFn({ method: "POST" })
  .validator((d: RegisterForm) => d)
  .handler(async ({ data: formData }) => {
    const supabase = getSupabaseServiceClient();
    const { error, data } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });

    if (data.user) {
      await supabase.from("users").insert({
        id: data.user.id,
      });
    }

    if (error) {
      throw new Error(error.message);
    }
  });

function RouteComponent() {
  const navigate = useNavigate();
  const form = useForm({
    defaultValues: defaultRegister,
    onSubmit: async (values) => {
      try {
        await registerFn({ data: values.value });
        navigate({
          to: "/login",
        });
      } catch (error) {
        toast.error(error.message);
      }
    },
  });

  return (
    <div className="flex flex-1">
      {/* Left column */}
      <div className="flex-col items-center justify-center w-1/2 hidden md:flex">
        <h1 className="text-xl">Custom content here</h1>
      </div>

      {/* Right column */}
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 gap-8">
        {/* Header */}
        <div className="w-[70%] text-center">
          <h1 className="text-2xl font-bold">Welcome to our store!</h1>
          <h3 className="text-lg text-muted-foreground mt-2">Please log in to continue.</h3>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex flex-col gap-3 w-[70%]"
        >
          <form.Field
            name="email"
            validators={{
              onChange: ({ value }) =>
                !value ? "An email is required" : value.length < 5 ? "Email must be at least 5 characters" : undefined,
            }}
          >
            {(field) => (
              <>
                <Label htmlFor={field.name} className="font-bold text-md">
                  Email
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="email"
                  autoComplete="email"
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
            name="password"
            validators={{
              onChange: ({ value }) =>
                !value
                  ? "A password is required"
                  : value.length < 5
                    ? "Password must be at least 5 characters"
                    : undefined,
            }}
          >
            {(field) => (
              <>
                <Label htmlFor={field.name} className="font-bold text-md">
                  Password
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  autoComplete="new-password"
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
            name="repeatPassword"
            validators={{
              onChangeListenTo: ["password"],
              onChange: ({ value, fieldApi }) => {
                if (!value) {
                  return "Please repeat your password";
                } else if (value.length < 5) {
                  return "Password must be at least 5 characters";
                } else if (value !== fieldApi.form.getFieldValue("password")) {
                  return "Passwords do not match";
                }
                return undefined;
              },
            }}
          >
            {(field) => (
              <>
                <Label htmlFor={field.name} className="font-bold text-md">
                  Repeat Password
                </Label>
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  type="password"
                  autoComplete="new-password"
                />
                <div className="text-destructive text-sm min-h-5">
                  {field.state.meta.errors.map((err) => (
                    <div key={err}>{err}</div>
                  ))}
                </div>
              </>
            )}
          </form.Field>

          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit} className="mt-6">
                {isSubmitting ? "..." : "Register"}
              </Button>
            )}
          </form.Subscribe>
        </form>

        {/* Separator */}
        <div className="flex items-center justify-center w-[75%]">
          <Separator className="flex-1" />
          <span className="mx-4 text-muted-foreground">lub</span>
          <Separator className="flex-1" />
        </div>

        {/* Social logins */}
        <div className="flex flex-col gap-3 w-[70%]">
          <SocialLogins />
        </div>
        <h4 className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="text-primary hover:underline font-semibold">
            Login here
          </Link>
        </h4>
      </div>
    </div>
  );
}
