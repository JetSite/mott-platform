import Image from "next/image";

import { Button } from "@mott/ui/button";

import { LogoIcon } from "~/components/icons/logo-icon";
import { MenuIcon } from "~/components/icons/menu-icon";

export const Header = () => {
  return (
    <div className="mb-[32px] flex h-[66px] w-full items-center pb-2 pt-2 max-md:px-5">
      <LogoIcon />
      <div className="flex h-full w-full items-center justify-end gap-5">
        <Button
          variant="outline"
          size="sm"
          aria-label="Invite Member"
          className="w-[108px] text-gray-400"
        >
          + Invite Member
        </Button>
        <Image src="/assets/avatar.png" width={44} height={44} alt="Avatar" />
        <MenuIcon />
      </div>
    </div>
  );
};
