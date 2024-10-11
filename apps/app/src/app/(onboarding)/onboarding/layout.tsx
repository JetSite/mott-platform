"use client";

import { LoginFormProvider } from "~/components/forms/login-form-context";
import { LogoIcon } from "~/components/icons/logo-icon";

export default function OnboardingLayout(props: { children: React.ReactNode }) {
  return (
    <LoginFormProvider>
      <div className="container h-screen">
        <div className="m-auto flex h-full max-w-[324px] flex-col pb-4 pt-[76px]">
          <LogoIcon />
          <div className="mt-[100px]">{props.children}</div>
        </div>
      </div>
    </LoginFormProvider>
  );
}
