import { redirect, RedirectType } from "next/navigation";

import { paths } from "~/routes/paths";
import { getOnboardingStatusAction } from "./actions";

export default async function OnboardingPage() {
  const status = await getOnboardingStatusAction();

  if (status?.completed) {
    redirect(paths.dashboard.root);
  }

  if (status?.currentStep === "full_name") {
    redirect(paths.onboarding.fullName);
  }

  redirect(paths.onboarding.companySetup, RedirectType.push);
}
