import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getSupabaseServerClient } from "@/utils/supabase";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

export const Route = createFileRoute("/profile/address")({
  component: RouteComponent,
});

const updateUserAddressFn = createServerFn({ method: "POST" })
  .validator((d: AddressForm) => d)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({
      data: {
        address: {
          country: data.country,
          city: data.city,
          street: data.street,
          postalCode: data.postalCode,
          state: data.state,
        },
      },
    });

    if (error) {
      throw new Error(error.message);
    }
  });

interface AddressForm {
  country: string;
  city: string;
  street: string;
  postalCode: string;
  state: string;
}

function RouteComponent() {
  const user = Route.useRouteContext().user;
  const router = useRouter();

  const defaultValues: AddressForm = {
    country: user?.address?.country || "",
    city: user?.address?.city || "",
    street: user?.address?.street || "",
    postalCode: user?.address?.postalCode || "",
    state: user?.address?.state || "",
  };

  const form = useForm({
    defaultValues,
    onSubmit: async (values) => {
      try {
        await updateUserAddressFn({ data: values.value });
        toast.success("Address updated successfully");
        router.invalidate();
      } catch (error) {
        toast.error("Failed to update address");
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
          name="country"
          validators={{
            onChange: ({ value }) =>
              !value ? "A country is required" : value.length < 2 ? "Country must be at least 2 characters" : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Country</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                autoComplete="address-level1"
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
          name="city"
          validators={{
            onChange: ({ value }) =>
              !value ? "A city is required" : value.length < 2 ? "City must be at least 2 characters" : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>City</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                autoComplete="address-level2"
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
          name="street"
          validators={{
            onChange: ({ value }) =>
              !value ? "A street is required" : value.length < 2 ? "Street must be at least 2 characters" : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Street</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                autoComplete="address-line1"
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
          name="postalCode"
          validators={{
            onChange: ({ value }) =>
              !value
                ? "A postal code is required"
                : value.length < 2
                  ? "Postal code must be at least 2 characters"
                  : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>Postal Code</Label>
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
        <form.Field
          name="state"
          validators={{
            onChange: ({ value }) =>
              !value ? "A state is required" : value.length < 2 ? "State must be at least 2 characters" : undefined,
          }}
        >
          {(field) => (
            <>
              <Label htmlFor={field.name}>State</Label>
              <Input
                id={field.name}
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                type="text"
                autoComplete="address-level1"
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
