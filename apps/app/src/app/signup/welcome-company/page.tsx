"use client";

import { useRouter } from "next/navigation";

import { Button } from "@mott/ui/button";

import { useSignUpFormContext } from "../signup-form-context";

export default function WelcomeCompanyPage() {
  const router = useRouter();
  const { formValues } = useSignUpFormContext();

  const handleNext = () => {
    router.push("/signup/your-company");
  };

  return (
    <>
      <div className="mb-[92px]">
        <h1 className="mb-[20px] text-3xl font-bold tracking-tight">
          Welcome, {formValues.fullname}!
        </h1>
        <h2 className="mb-[50px] text-2xl font-bold tracking-tight text-neutral-400">
          Let`s set up your corporate account and workspace now.
        </h2>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-400">
          There are 3 steps only.
        </h2>
      </div>

      <Button
        size="lg"
        variant="primary"
        aria-label="Get Started"
        className="w-full bg-black text-white hover:bg-white hover:text-black"
        onClick={handleNext}
      >
        Get Started
      </Button>
    </>
  );
}
