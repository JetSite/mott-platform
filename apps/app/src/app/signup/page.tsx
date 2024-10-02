"use client";

import type { Control } from "react-hook-form";
import React, { useMemo, useState } from "react";
import { z } from "zod";

import { Button } from "@mott/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@mott/ui/form";
import { Input } from "@mott/ui/input";

import { GoogleIcon } from "./assets/googleIcon";
import { LogoIcon } from "./assets/logoIcon";

const EmailStep = ({ control }: { control: Control<any> }) => {
  return (
    <>
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-600">
              Email
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter your email address..." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const AccessCodeStep = ({ control }: { control: Control<any> }) => {
  return (
    <>
      <FormField
        control={control}
        name="accessCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-600">
              Code
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Code" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const FullNameStep = ({ control }: { control: Control<any> }) => {
  return (
    <>
      <FormField
        control={control}
        name="fullname"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-600">
              Full name
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Full Name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

const getStepForm = (step: number, control: Control<any>) => {
  switch (step) {
    case 0:
      return <EmailStep control={control} />;
    case 1:
      return <AccessCodeStep control={control} />;
    case 2:
      return <FullNameStep control={control} />;
  }
};

const EmailContent = () => {
  return (
    <div className="border border-l-0 border-r-0 border-t-0 border-slate-300">
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
        className="mb-10 flex w-full gap-2"
      >
        <GoogleIcon />
        <p>Continue with Google</p>
      </Button>
    </div>
  );
};

const AccessCodeContent = () => {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Enter Access Code</h1>
      <h2 className="text-lg font-medium tracking-tight text-slate-300">
        Enter the 6-digit code to confirm you received the text message.
      </h2>
    </>
  );
};

const FullNameContent = () => {
  return (
    <>
      <h1 className="text-2xl font-bold tracking-tight">Your Name</h1>
      <h2 className="text-lg font-medium tracking-tight text-slate-300">
        Please enter your name so we can personalize your experience.
      </h2>
    </>
  );
};

const WelcomeContent = ({ name }: { name: string }) => {
  return (
    <div className="mb-28 mt-14 flex flex-col justify-center">
      <div className="mb-[130px]">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          Welcome, {name}!
        </h1>
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-slate-300">
          Now you can {""}
          <span className="text-2xl font-bold text-black">
            chat with Mott {""}
          </span>
          in your corporate
          <span className="text-2xl font-bold text-black">{""} Slack.</span>
        </h2>
        <h2 className="text-2xl font-bold tracking-tight text-slate-300">
          For better results,
          <span className="text-2xl font-bold text-black">
            {""} adjust your settings.
          </span>
        </h2>
      </div>
      <Button
        size="lg"
        variant="primary"
        aria-label="Continue"
        className="w-full bg-black text-white hover:bg-white hover:text-black"
      >
        Get started
      </Button>
    </div>
  );
};

const getStepContent = (step: number) => {
  switch (step) {
    case 0:
      return <EmailContent />;
    case 1:
      return <AccessCodeContent />;
    case 2:
      return <FullNameContent />;
    default:
      return "Unknown step";
  }
};

const validationSchema = [
  z.object({
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("This is not a valid email."),
  }),

  z.object({
    accessCode: z.string().min(6, { message: "Access code is required" }),
  }),

  z.object({
    fullname: z.string().min(3, { message: "Question code is required" }),
  }),
];

const MAX_STEPS = 2;

export default function AuthPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [name, setName] = useState("");

  const currentValidationSchema = useMemo(() => {
    return validationSchema[currentStep];
  }, [currentStep]);

  const form = useForm({
    // @ts-ignore
    schema: currentValidationSchema,
    mode: "onSubmit",
  });

  const onSubmit = (data: any) => {
    setName(data.fullname);
  };

  const handleNext = async () => {
    if (MAX_STEPS === currentStep) {
      form.handleSubmit(onSubmit);
      return;
    }

    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }
    setCurrentStep((prevActiveStep) => prevActiveStep + 1);
  };

  return (
    <div className="container h-screen">
      <div className="m-auto flex h-full max-w-[346px] flex-col pb-4 pt-4">
        <div className="mb-10 mt-16">
          <LogoIcon />
        </div>
        <div className={`mt-12 flex flex-col gap-20 ${name ? "h-full" : ""}`}>
          {name ? (
            <div className="">
              <WelcomeContent name={name} />
            </div>
          ) : (
            <div className="mb-28 flex h-[366px] flex-col justify-center">
              <div className="mb-10 h-[140px]">
                {getStepContent(currentStep)}
              </div>
              <div className="h-[176px]">
                <Form {...form}>
                  <form
                    className="flex w-full max-w-2xl flex-col gap-4"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    {getStepForm(currentStep, form.control)}

                    <Button
                      size="lg"
                      variant="primary"
                      aria-label="Continue"
                      className="mt-14 bg-black text-white hover:bg-white hover:text-black"
                      onClick={handleNext}
                    >
                      Continue
                    </Button>
                  </form>
                </Form>
              </div>
            </div>
          )}
        </div>

        <div className="h-8 text-center">
          {currentStep === 0 && (
            <span className="text-sm text-gray-500">
               By continuing, you agree to the Terms & Conditions and Privacy
              Policies.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
