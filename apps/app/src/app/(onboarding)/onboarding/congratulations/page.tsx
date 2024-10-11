"use client";

import { useRouter } from "next/navigation";

import { Button } from "@mott/ui/button";

import { ThumbsUpIcon } from "~/components/icons/thumbs-up-icon";

export default function CongratulationPage() {
  const router = useRouter();

  const handleDone = () => {
    router.push("/home");
  };

  return (
    <>
      <div className="mb-[100px] mt-[-14px]">
        <div className="mb-7">
          <ThumbsUpIcon />
        </div>
        <h1 className="mb-[18px] text-3xl font-bold tracking-tight">
          Congratulations!
        </h1>
        <h2 className="mb-[58px] text-2xl font-semibold tracking-tight text-neutral-400">
          Mott registered the account successfully. Go to your settings to get
          started.
        </h2>
      </div>

      <Button
        size="lg"
        variant="primary"
        aria-label="Get Started"
        className="w-full"
        onClick={handleDone}
      >
        Done
      </Button>
    </>
  );
}
