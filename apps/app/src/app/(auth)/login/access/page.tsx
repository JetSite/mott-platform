"use client";

import type { AccessCodeForm } from "@mott/validators";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@mott/ui/button";
import { Form, FormControl, FormField, FormItem, useForm } from "@mott/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@mott/ui/input-otp";
import { accessCodeSchema } from "@mott/validators";

import { useLoginFormContext } from "~/components/forms/login-form-context";
import { paths } from "~/routes/paths";

const LEFT_SECONDS = 30;
const COUNT_NUMBER_CODE = 6;

function useCountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(LEFT_SECONDS);

  useEffect(() => {
    if (timeLeft === 0) {
      return;
    }

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

  const errorMessage = form.formState.errors.accessCode?.message;

  const { updateFormValues } = useLoginFormContext();
  const timeLeft = useCountdownTimer();

  const onSubmit = async (data: AccessCodeForm) => {
    const isStepValid = await form.trigger();
    if (!isStepValid) {
      return;
    }

    updateFormValues(data);
    router.push(paths.onboarding.fullName);
  };

  const handleBack = () => {
    router.push(paths.login.root);
  };

  return (
    <>
      <div className="mb-24">
        <h1 className="text-2xl font-bold tracking-tight">Enter Access Code</h1>
        <h2 className="text-lg font-medium tracking-tight text-neutral-400">
          Enter the 6-digit code to confirm you received the text message.
        </h2>
      </div>
      <Form {...form}>
        <form
          className="flex w-full max-w-2xl flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex justify-between gap-[10px]">
            <FormField
              control={form.control}
              name="accessCode"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <>
                        {Array.from(
                          { length: COUNT_NUMBER_CODE },
                          (_, index) => (
                            <InputOTPGroup key={index}>
                              <InputOTPSlot
                                className={`h-10 w-[45px] ${errorMessage && "border border-red-600"}`}
                                index={index}
                              />
                            </InputOTPGroup>
                          ),
                        )}
                      </>
                    </InputOTP>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="h-10">
            {errorMessage && (
              <p className={"text-[0.8rem] font-medium text-destructive"}>
                {errorMessage}
              </p>
            )}
            <p className={"text-[0.8rem] text-neutral-400"}>
              Get new code ({timeLeft} seconds)
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            variant="primary"
            aria-label="Continue"
            className="mt-7"
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
