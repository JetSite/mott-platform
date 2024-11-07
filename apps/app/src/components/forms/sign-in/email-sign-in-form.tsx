import type { EmailForm } from "@mott/validators";
import type { UseFormReturn } from "react-hook-form";
import { signIn } from "next-auth/react";

import { Button } from "@mott/ui/custom/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@mott/ui/form";

import { GoogleIcon } from "~/components/icons/google-icon";
import { paths } from "~/routes/paths";
import { EMAIL_DESCRIPTION, EMAIL_PLACEHOLDER } from "./constants";

export default function EmailSignInForm({
  emailForm,
  onSubmit,
  loading,
}: {
  emailForm: UseFormReturn<EmailForm>;
  onSubmit: (data: EmailForm) => Promise<void>;
  loading: boolean;
}) {
  return (
    <>
      <Button
        variant="outline"
        size="lg"
        aria-label="Sign in with Google"
        className="mb-10 flex h-[50px] w-full gap-2"
        onClick={() => signIn("google", { redirectTo: paths.onboarding.root })}
      >
        <GoogleIcon />
        <p>Continue with Google</p>
      </Button>
      <div className="border border-b-0 border-l-0 border-r-0 border-slate-300 pt-3">
        <Form {...emailForm}>
          <form
            className="flex w-full max-w-2xl flex-col gap-4"
            onSubmit={emailForm.handleSubmit(onSubmit)}
          >
            <FormField
              control={emailForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Email</FormLabel>
                  <FormControl>
                    <input
                      {...field}
                      placeholder={EMAIL_PLACEHOLDER}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </FormControl>
                  <FormDescription>{EMAIL_DESCRIPTION}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              size="lg"
              variant="primary"
              aria-label="Continue"
              className="mt-6"
              loading={loading}
            >
              {loading ? "Logging in..." : "Continue"}
            </Button>
          </form>
        </Form>
      </div>
    </>
  );
}
