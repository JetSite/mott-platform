import type { db as dbClient } from "@mott/db/client";
import { eq } from "drizzle-orm";

import { OnboardingData, User } from "@mott/db/schema";

export interface OnboardingStatus {
  completed: boolean;
  currentStep: string;
  stepDescription: string;
}

export async function getOnboardingStatus(
  db: typeof dbClient,
  userId: string,
): Promise<OnboardingStatus> {
  if (!userId) {
    throw new Error("User ID is required");
  }
  try {
    const user = await db.query.User.findFirst({
      where: eq(User.id, userId),
      columns: {
        name: true,
      },
    });

    if (!user?.name) {
      return {
        completed: false,
        currentStep: "full_name",
        stepDescription: "Fill in your full name",
      };
    }

    const onboardingData = await db.query.OnboardingData.findFirst({
      where: eq(OnboardingData.userId, userId),
      columns: {
        companyName: true,
        companyWebsite: true,
        corporateChat: true,
      },
    });

    if (!onboardingData) {
      return {
        completed: false,
        currentStep: "welcome",
        stepDescription: "Welcome to the onboarding process",
      };
    }

    if (!onboardingData.companyName || !onboardingData.companyWebsite) {
      return {
        completed: false,
        currentStep: "company_name",
        stepDescription: "Fill in your company name",
      };
    }

    if (!onboardingData.corporateChat) {
      return {
        completed: false,
        currentStep: "corporate_chat",
        stepDescription: "Set your corporate chat",
      };
    }

    return {
      completed: true,
      currentStep: "completed",
      stepDescription: "Onboarding completed",
    };
  } catch (error) {
    console.error("Error getting onboarding status:", error);
    return {
      completed: false,
      currentStep: "unknown",
      stepDescription: "Unknown error",
    };
  }
}
