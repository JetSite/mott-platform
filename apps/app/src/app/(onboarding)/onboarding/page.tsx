import { redirect } from "next/navigation";

import { paths } from "~/routes/paths";
import { getOnboardingStatusAction } from "./actions";

export default async function OnboardingPage() {
  let redirectUrl: string | null = null;
  try {
    const status = await getOnboardingStatusAction();

    if (status?.completed) {
      redirectUrl = paths.dashboard.root;
    }

    if (status?.currentStep === "full_name") {
      redirectUrl = paths.onboarding.fullName;
    }

    redirectUrl = paths.onboarding.companySetup;
  } catch (error) {
    console.error(error);
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
}
