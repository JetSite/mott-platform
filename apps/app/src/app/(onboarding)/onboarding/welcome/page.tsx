"use client";

import { useRouter } from "next/navigation";

import { Button } from "@mott/ui/button";

import { useLoginFormContext } from "~/components/forms/login-form-context";
import { paths } from "~/routes/paths";

export default function WelcomePage() {
  const router = useRouter();
  const { formValues } = useLoginFormContext();

  const handleNext = () => {
    router.push(paths.onboarding.welcomeCompany);
  };

  return (
    <>
      <div className="mb-[86px]">
        <h1 className="mb-[20px] text-3xl font-bold tracking-tight">
          Welcome, {formValues.fullName}!
        </h1>
        <h2 className="mb-[58px] text-2xl font-bold tracking-tight text-neutral-400">
          Now you can {""}
          <span className="text-2xl font-bold text-black">
            chat with Mott {""}
          </span>
          in your corporate
          <span className="text-2xl font-bold text-black">{""} Slack.</span>
        </h2>
        <h2 className="text-2xl font-bold tracking-tight text-neutral-400">
          For better results,
          <span className="text-2xl font-bold text-black">
            {""} adjust your settings.
          </span>
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
