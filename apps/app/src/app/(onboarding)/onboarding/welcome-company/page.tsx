import Link from "next/link";

import { auth } from "@mott/auth";
import { Button } from "@mott/ui/button";

import { paths } from "~/routes/paths";

export default async function WelcomeCompanyPage() {
  const session = await auth();

  return (
    <>
      <div className="mb-[92px]">
        <h1 className="mb-[20px] text-3xl font-bold tracking-tight">
          Welcome, {session?.user.name}!
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
        className="w-full"
        asChild
      >
        <Link href={paths.onboarding.companySetup}>Get Started</Link>
      </Button>
    </>
  );
}
