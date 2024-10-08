"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mott/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@mott/ui/form";
import { Input } from "@mott/ui/input";

import type { EmailForm } from "./types";
import { GoogleIcon } from "~/components/icons/google-icon";
import { useSignUpFormContext } from "./signup-form-context";
import { emailSchema } from "./types";

export default function AuthPage() {
  const router = useRouter();
  const { updateFormValues } = useSignUpFormContext();

  const form = useForm({
    schema: emailSchema,
    mode: "onSubmit",
  });

  const onSubmit = async (data: EmailForm) => {
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }

    updateFormValues(data);
    router.push("/signup/access");
  };

  return (
    <>
      <div>
        <div className="mb-[100px]">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Your data, your way.
            </h1>
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-300">
              Create your Mott account
            </h2>
            <Button
              variant="outline"
              size="lg"
              aria-label="Sign in with Google"
              className="mb-10 flex h-[50px] w-full gap-2"
            >
              <GoogleIcon />
              <p>Continue with Google</p>
            </Button>
          </div>

          <div className="border border-b-0 border-l-0 border-r-0 border-slate-300 pt-3">
            <Form {...form}>
              <form
                className="flex w-full max-w-2xl flex-col gap-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-600">
                        Email
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your email address..."
                        />
                      </FormControl>
                      <FormDescription>
                        Proceed with your business email
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  size="lg"
                  variant="primary"
                  aria-label="Continue"
                  className="mt-6 bg-black text-white hover:bg-white hover:text-black"
                >
                  Continue
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>

      <div className="h-8 text-center text-xs">
        <span className="text-sm text-gray-500">
          By continuing, you agree to the Terms & Conditions and Privacy
          Policies.
        </span>
      </div>
    </>
  );
}
