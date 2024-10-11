"use client";

import { useCallback, useState } from "react";
import Image from "next/image";
import { Cross2Icon } from "@radix-ui/react-icons";

import { Button } from "@mott/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mott/ui/select";

import { Sidebar } from "~/app/(app)/home/_components/sidebar";
import { LogoIcon } from "~/components/icons/logo-icon";
import { MenuIcon } from "~/components/icons/menu-icon";
import { useTargetClick } from "~/utils/use-target-click";

const workSpaces = [
  { value: "hims", title: "Hims", img: "/assets/avatar.png" },
  { value: "hers", title: "Hims", img: "/assets/hers.png" },
];

const WorkspaceSelect = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState("hims");
  return (
    <Select
      value={selectedWorkspace}
      onValueChange={(value) => {
        setSelectedWorkspace(value);
      }}
    >
      <SelectTrigger className="my-6 h-[62px]">
        <SelectValue placeholder={"placeholder"} />
      </SelectTrigger>

      <SelectContent className="text-base">
        {workSpaces.map(({ value, title, img }) => (
          <SelectItem value={value} key={value} className="h-[62px]">
            <div className="flex items-center justify-center gap-3">
              <Image src={img} width={46} height={46} alt="Avatar" />
              {title}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export const Header = () => {
  const [isOpenSideBar, setIsOpenSideBar] = useState(false);

  const handleToggleSidebar = useCallback(() => {
    setIsOpenSideBar((prev) => !prev);
  }, []);

  const sideBarRef = useTargetClick(handleToggleSidebar);

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
        <Image src="/assets/hims.png" width={44} height={44} alt="Avatar" />
        <MenuIcon
          onClick={handleToggleSidebar}
          className="cursor-pointer md:hidden"
        />
        {isOpenSideBar && (
          <div className="absolute left-0 right-0 top-0 z-10 flex flex-col border bg-[#F8F8F8] px-5 py-8">
            <Cross2Icon
              width={20}
              height={20}
              className="cursor-pointer self-end"
              onClick={handleToggleSidebar}
            />
            <WorkspaceSelect />
            <div ref={sideBarRef}>
              <Sidebar />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
