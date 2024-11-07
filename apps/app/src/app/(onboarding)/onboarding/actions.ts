"use server";

import { getOnboardingStatus } from "@mott/api/lib/onboarding/status";
import { auth } from "@mott/auth";
import { db } from "@mott/db/client";

export async function getOnboardingStatusAction() {
  const session = await auth();
  if (!session) {
    return null;
  }
  return await getOnboardingStatus(db, session.user.id);
}
