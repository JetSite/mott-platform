"use client";

import type { EmailForm, OtpForm } from "@mott/validators";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
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
  useForm,
} from "@mott/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@mott/ui/input-otp";
import { toast } from "@mott/ui/toast";
import { emailSchema, otpSchema } from "@mott/validators";

import { GoogleIcon } from "~/components/icons/google-icon";
import { useBoolean } from "~/hooks/use-boolean";
import { paths } from "~/routes/paths";

const COUNT_NUMBER_CODE = 6;

export default function OtpSignIn() {
  const router = useRouter();
  const loading = useBoolean();
  const otpLoading = useBoolean();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState("");
  const [resendingCode, setResendingCode] = useState(false);
  const [codeResent, setCodeResent] = useState(false);
  const emailForm = useForm({
    schema: emailSchema,
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const otpForm = useForm({
    schema: otpSchema,
    mode: "onSubmit",
    defaultValues: {
      otp: "",
    },
  });

  const errorMessage = otpForm.formState.errors.otp?.message;

  useEffect(() => {
    if (showOtpInput) {
      otpForm.reset({ otp: "" });
    }
  }, [showOtpInput, otpForm]);

  const handleResendCode = async () => {
    setResendingCode(true);
    setCodeResent(false);
    const isCodeSent = await sendOtpCode(email);
    if (isCodeSent) {
      setCodeResent(true);
      setTimeout(() => setCodeResent(false), 3000);
    }
    setResendingCode(false);
  };

  const sendOtpCode = async (email: string) => {
    const login = await signIn("resend", {
      email: email,
      redirect: false,
    });
    if (login?.error) {
      toast.error(login.error);
      return false;
    }
    return true;
  };

  const onEmailSubmit = async (data: EmailForm) => {
    loading.onTrue();
    const isStepValid = await emailForm.trigger();

    if (!isStepValid) {
      loading.onFalse();
      return;
    }

    const isCodeSent = await sendOtpCode(data.email);
    if (isCodeSent) {
      setEmail(data.email);
      setShowOtpInput(true);
    }
    loading.onFalse();
  };

  const handleOtpComplete = async (otp: string) => {
    await onOtpSubmit({ otp });
  };

  const onOtpSubmit = async (data: OtpForm) => {
    otpLoading.onTrue();
    const isStepValid = await otpForm.trigger();
    if (!isStepValid) {
      return;
    }

    const url = new URL("/api/auth/callback/resend", window.location.href);
    url.searchParams.append("token", data.otp);
    url.searchParams.append("email", email);
    const res = await fetch(url);

    if (res.status !== 200) {
      toast.error("Wrong access code");
      otpLoading.onFalse();
      return;
    }

    toast.success("Login successful");
    router.push(paths.dashboard.root);
    otpLoading.onFalse();
  };

  const handleBack = () => {
    setShowOtpInput(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">
        {showOtpInput ? "Enter Access Code" : "Your data, your way."}
      </h1>
      <h2
        className={`mb-6 ${showOtpInput ? "text-lg" : "text-2xl"} font-bold tracking-tight text-neutral-400`}
      >
        {showOtpInput
          ? "Enter the 6-digit code to confirm you received the text message."
          : "Create your Mott account"}
      </h2>

      {!showOtpInput ? (
        <>
          <Button
            variant="outline"
            size="lg"
            aria-label="Sign in with Google"
            className="mb-10 flex h-[50px] w-full gap-2"
            onClick={() =>
              signIn("google", { redirectTo: paths.dashboard.root })
            }
          >
            <GoogleIcon />
            <p>Continue with Google</p>
          </Button>
          <div className="border border-b-0 border-l-0 border-r-0 border-slate-300 pt-3">
            <Form {...emailForm}>
              <form
                className="flex w-full max-w-2xl flex-col gap-4"
                onSubmit={emailForm.handleSubmit(onEmailSubmit)}
              >
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium">
                        Email
                      </FormLabel>
                      <FormControl>
                        <input
                          {...field}
                          placeholder="Enter your email address..."
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="mt-6"
                  loading={loading.value}
                >
                  {loading.value ? "Logging in..." : "Continue"}
                </Button>
              </form>
            </Form>
          </div>
        </>
      ) : (
        <Form {...otpForm}>
          <form
            className="flex w-full max-w-2xl flex-col gap-4"
            onSubmit={otpForm.handleSubmit(onOtpSubmit)}
          >
            <p className="mb-4">Verification code sent to {email}</p>
            <div className="flex justify-between gap-[10px]">
              <FormField
                control={otpForm.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputOTP
                        maxLength={6}
                        onComplete={handleOtpComplete}
                        {...field}
                      >
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
            <div className="flex h-10 items-center">
              {errorMessage && (
                <p className={"text-[0.8rem] font-medium text-destructive"}>
                  {errorMessage.toString()}
                </p>
              )}
              <div className="flex items-center gap-2">
                {resendingCode && <Loader2 className="h-4 w-4 animate-spin" />}
                {codeResent && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendingCode}
                  className={
                    "text-[0.8rem] text-neutral-400 transition-colors hover:text-neutral-600"
                  }
                >
                  Get new code
                </button>
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              variant="primary"
              aria-label="Continue"
              loading={otpLoading.value}
            >
              {otpLoading.value ? "Verifying..." : "Continue"}
            </Button>
          </form>
        </Form>
      )}

      {showOtpInput && (
        <Button
          size="lg"
          variant="ghost"
          aria-label="Back"
          className="mt-2 w-full"
          onClick={handleBack}
        >
          Back
        </Button>
      )}

      <div className="mt-8 h-8 text-center text-xs">
        <span className="text-sm text-neutral-400">
          By continuing, you agree to the Terms & Conditions and Privacy
          Policies.
        </span>
      </div>
    </div>
  );
}
