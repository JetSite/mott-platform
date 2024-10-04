"use client";

import { useEffect, useState } from "react";
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

import { useSignUpFormContext } from "../signup-form-context";
import type { AccessCodeForm} from "../types";
import { accessCodeSchema } from "../types";

const LEFT_SECONDS = 30;

function useCountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(LEFT_SECONDS);

  useEffect(() => {
    if (timeLeft === 0) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  return timeLeft;
}

export default function AccessCodePage() {
  const router = useRouter();
  const form = useForm({
    schema: accessCodeSchema,
    mode: "onSubmit",
  });

  const { updateFormValues } = useSignUpFormContext();
  const timeLeft = useCountdownTimer();

  const onSubmit = async (data: AccessCodeForm) => {
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }

    updateFormValues(data);
    router.push("/signup/fullname");
  };

  const handleBack = () => {
    router.push("/signup");
  };

  return (
    <>
      <div className="mb-24">
        <h1 className="text-2xl font-bold tracking-tight">Enter Access Code</h1>
        <h2 className="text-lg font-medium tracking-tight text-slate-300">
          Enter the 6-digit code to confirm you received the text message.
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex w-full max-w-2xl flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="accessCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                  Code
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Code" />
                </FormControl>
                <FormDescription>
                  Get new code ({timeLeft} seconds)
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
            className="mt-7 bg-black text-white hover:bg-white hover:text-black"
          >
            Continue
          </Button>
        </form>
      </Form>
      <Button
        size="lg"
        variant="ghost"
        aria-label="Back"
        className="mt-2 w-full"
        onClick={handleBack}
      >
        Back
      </Button>
    </>
  );
}
