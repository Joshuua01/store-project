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
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
              <path
                fill="#FF3D00"
                d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
              ></path>
              <path
                fill="#4CAF50"
                d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
              ></path>
              <path
                fill="#1976D2"
                d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
              ></path>
            </svg>
            Continue with Google
          </Button>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
              <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z"></path>
            </svg>
            Continue with Apple
          </Button>
          <Button variant="outline">
            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 48 48">
              <linearGradient
                id="Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1"
                x1="9.993"
                x2="40.615"
                y1="9.993"
                y2="40.615"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#2aa4f4"></stop>
                <stop offset="1" stopColor="#007ad9"></stop>
              </linearGradient>
              <path
                fill="url(#Ld6sqrtcxMyckEl6xeDdMa_uLWV5A9vXIPu_gr1)"
                d="M24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20S35.046,4,24,4z"
              ></path>
              <path
                fill="#fff"
                d="M26.707,29.301h5.176l0.813-5.258h-5.989v-2.874c0-2.184,0.714-4.121,2.757-4.121h3.283V12.46 c-0.577-0.078-1.797-0.248-4.102-0.248c-4.814,0-7.636,2.542-7.636,8.334v3.498H16.06v5.258h4.948v14.452 C21.988,43.9,22.981,44,24,44c0.921,0,1.82-0.084,2.707-0.204V29.301z"
              ></path>
            </svg>
            Continue with Facebook
          </Button>
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
