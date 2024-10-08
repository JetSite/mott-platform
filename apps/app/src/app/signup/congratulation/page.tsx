"use client";

import { Button } from "@mott/ui/button";

import { ThumbsUpIcon } from "~/components/thumbs-up-icon";

export default function CongratulationPage() {
  return (
    <>
      <div className="mb-[100px] mt-[-14px]">
        <div className="mb-7">
          <ThumbsUpIcon />
        </div>
        <h1 className="mb-[18px] text-3xl font-bold tracking-tight">
          Congratulations!
        </h1>
        <h2 className="mb-[58px] text-2xl font-semibold tracking-tight text-slate-300">
          Mott registered the account successfully. Go to your settings to get
          started.
        </h2>
      </div>

      <Button
        size="lg"
        variant="primary"
        aria-label="Get Started"
        className="w-full bg-black text-white hover:bg-white hover:text-black"
      >
        Done
      </Button>
    </>
  );
}