"use client";

import type { CompanyForm } from "@mott/validators";
import { useRouter } from "next/navigation";

import { Button } from "@mott/ui/custom/button";
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
import { toast } from "@mott/ui/toast";
import { companySchema } from "@mott/validators";

import { useBoolean } from "~/hooks/use-boolean";
import { paths } from "~/routes/paths";
import { api } from "~/trpc/react";

export default function CompanySetupPage() {
  const router = useRouter();
  const loading = useBoolean();
  const { mutateAsync: saveCompanyInfo } =
    api.auth.saveCompanyInfo.useMutation();
  const form = useForm({
    schema: companySchema,
    mode: "onSubmit",
  });

  const onSubmit = async (data: CompanyForm) => {
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }

    try {
      loading.onTrue();
      await saveCompanyInfo({
        companyName: data.companyName,
        companyWebsite: data.companyWebsite,
      });
    } catch (error) {
      loading.onFalse();
      console.error("Error saving company info:", error);
      toast.error("Error saving company info");
    }
    router.push(paths.onboarding.corporateChat);
  };

  const handleBack = () => {
    router.push(paths.onboarding.welcomeCompany);
  };

  return (
    <>
      <div className="mb-6 mt-[-80px]">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Your Company</h1>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-400">
          We`re glad to have you on the Mott platform! Let`s set up your company
          account and workspace now.
        </h2>
      </div>
      <Form {...form}>
        <form
          className="mt-12 flex w-full max-w-2xl flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                  Company name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter your company name here.."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                  Corporate website
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="https://www.yoursite.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            variant="primary"
            aria-label="Continue"
            className="mt-16"
            loading={loading.value}
          >
            {loading.value ? "Saving..." : "Continue"}
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
