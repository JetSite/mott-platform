import { redirect } from "next/navigation";
import { match } from "ts-pattern";

import { paths } from "~/routes/paths";
import { getOnboardingStatusAction } from "./actions";

export default async function OnboardingPage() {
  const status = await getOnboardingStatusAction();
  match(status)
    .with({ completed: true }, () => redirect(paths.dashboard.root))
    .with({ currentStep: "full_name" }, () =>
      redirect(paths.onboarding.fullName),
    )
    .otherwise(() => redirect(paths.onboarding.companySetup));
  return null;
}
