"use client";

import type { EmailForm, OtpForm } from "@mott/validators";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";
import { match } from "ts-pattern";

import { Button } from "@mott/ui/custom/button";
import { useForm } from "@mott/ui/form";
import { toast } from "@mott/ui/toast";
import { emailSchema, otpSchema } from "@mott/validators";

import { useBoolean } from "~/hooks/use-boolean";
import { paths } from "~/routes/paths";
import { api } from "~/trpc/react";
import { TERMS_TEXT } from "./constants";
import EmailSignInForm from "./email-sign-in-form";
import Header from "./header";
import OtpSignInForm from "./otp-sign-in-form";

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="lg"
      variant="ghost"
      aria-label="Back"
      className="mt-2 w-full"
      onClick={onClick}
    >
      Back
    </Button>
  );
}

function TermsAndConditions() {
  return (
    <div className="mt-8 h-8 text-center text-xs">
      <span className="text-sm text-neutral-400">{TERMS_TEXT}</span>
    </div>
  );
}

export default function OtpSignIn() {
  const router = useRouter();
  const loading = useBoolean();
  const otpLoading = useBoolean();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [email, setEmail] = useState("");
  const [resendingCode, setResendingCode] = useState(false);
  const [codeResent, setCodeResent] = useState(false);
  const { mutateAsync: checkOnboardingStatus } =
    api.auth.checkOnboardingStatus.useMutation();

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

  const sendOtpCode = useCallback(async (email: string) => {
    try {
      const login = await signIn("resend", {
        email: email,
        redirect: false,
      });
      if (login?.error) {
        toast.error(login.error);
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error sending OTP code:", error);
      toast.error("Failed to send verification code. Please try again.");
      return false;
    }
  }, []);

  const handleResendCode = useCallback(async () => {
    setResendingCode(true);
    setCodeResent(false);
    const isCodeSent = await sendOtpCode(email);
    if (isCodeSent) {
      setCodeResent(true);
      setTimeout(() => setCodeResent(false), 3000);
    }
    setResendingCode(false);
  }, [email, sendOtpCode]);

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

  const onOtpSubmit = async (data: OtpForm) => {
    otpLoading.onTrue();
    const isStepValid = await otpForm.trigger();
    if (!isStepValid) {
      otpLoading.onFalse();
      return;
    }

    try {
      const url = new URL("/api/auth/callback/resend", window.location.href);
      url.searchParams.append("token", data.otp);
      url.searchParams.append("email", email);
      const res = await fetch(url);

      if (res.status !== 200) {
        throw new Error("Wrong access code");
      }

      toast.success("Login successful");
      const onboardingStatus = await checkOnboardingStatus();
      match(onboardingStatus)
        .with({ completed: true }, () => router.push(paths.dashboard.root))
        .with({ currentStep: "full_name" }, () =>
          router.push(paths.onboarding.fullName),
        )
        .otherwise(() => router.push(paths.onboarding.companySetup));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    } finally {
      otpLoading.onFalse();
    }
  };

  const handleBack = useCallback(() => {
    setShowOtpInput(false);
  }, []);

  return (
    <div>
      <Header showOtpInput={showOtpInput} />
      {!showOtpInput ? (
        <EmailSignInForm
          emailForm={emailForm as unknown as UseFormReturn<EmailForm>}
          onSubmit={onEmailSubmit}
          loading={loading.value}
        />
      ) : (
        <OtpSignInForm
          otpForm={otpForm as unknown as UseFormReturn<OtpForm>}
          onSubmit={onOtpSubmit}
          email={email}
          errorMessage={errorMessage}
          handleResendCode={handleResendCode}
          resendingCode={resendingCode}
          codeResent={codeResent}
          otpLoading={otpLoading.value}
        />
      )}
      {showOtpInput && <BackButton onClick={handleBack} />}
      <TermsAndConditions />
    </div>
  );
}
