import Link from "next/link";

import { auth } from "@mott/auth";
import { Button } from "@mott/ui/button";

import { paths } from "~/routes/paths";

export default async function WelcomePage() {
  const session = await auth();

  return (
    <>
      <div className="mb-[86px]">
        <h1 className="mb-[20px] text-3xl font-bold tracking-tight">
          Welcome, {session?.user.name}!
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
        className="w-full"
        asChild
      >
        <Link href={paths.onboarding.companySetup}>Get Started</Link>
      </Button>
    </>
  );
}
