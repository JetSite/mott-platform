import type { OtpForm } from "@mott/validators";
import type { UseFormReturn } from "react-hook-form";
import { CheckCircle, Loader2 } from "lucide-react";

import { Button } from "@mott/ui/custom/button";
import { Form, FormControl, FormField, FormItem } from "@mott/ui/form";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@mott/ui/input-otp";

import { COUNT_NUMBER_CODE } from "./constants";

export default function OtpSignInForm({
  otpForm,
  onSubmit,
  email,
  errorMessage,
  handleResendCode,
  resendingCode,
  codeResent,
  otpLoading,
}: {
  otpForm: UseFormReturn<OtpForm>;
  onSubmit: (data: OtpForm) => Promise<void>;
  email: string;
  errorMessage: string | undefined;
  handleResendCode: () => Promise<void>;
  resendingCode: boolean;
  codeResent: boolean;
  otpLoading: boolean;
}) {
  const handleComplete = (value: string) => {
    otpForm.setValue("otp", value);
    void otpForm.handleSubmit(onSubmit)();
  };
  return (
    <Form {...otpForm}>
      <form
        className="flex w-full max-w-2xl flex-col gap-4"
        onSubmit={otpForm.handleSubmit(onSubmit)}
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
                    onComplete={handleComplete}
                    {...field}
                  >
                    {[...Array(COUNT_NUMBER_CODE).keys()].map((item, index) => (
                      <InputOTPGroup key={`otp-slot-${item}`}>
                        <InputOTPSlot
                          className={`h-10 w-[45px] ${errorMessage && "border border-red-600"}`}
                          index={index}
                        />
                      </InputOTPGroup>
                    ))}
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
            {codeResent && <CheckCircle className="h-4 w-4 text-green-500" />}
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendingCode}
              className="text-[0.8rem] text-neutral-400 transition-colors hover:text-neutral-600"
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
          loading={otpLoading}
        >
          {otpLoading ? "Verifying..." : "Continue"}
        </Button>
      </form>
    </Form>
  );
}
