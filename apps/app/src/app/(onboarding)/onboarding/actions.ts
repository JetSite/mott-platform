"use server";

import { getOnboardingStatus } from "@mott/api/lib/onboarding/status";
import { auth } from "@mott/auth";

export async function getOnboardingStatusAction() {
  const session = await auth();
  if (!session) {
    return null;
  }
  return await getOnboardingStatus(session.user.id);
}
