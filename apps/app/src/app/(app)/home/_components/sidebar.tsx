"use client";

import React from "react";
import Link from "next/link";

import type { MenuItem } from "../../_components/menu-items";
import {
  getProfileSettingsItems,
  getWorkSpaceItems,
} from "../../_components/menu-items";

const iconConfig = {
  width: 28,
  height: 28,
  color: "#D4D4D4",
};

const otherMenuItems = ["Help", "Pricing", "Contacts", "Policies", "Out Blog"];

interface SectionProps {
  title: string;
  items: MenuItem[];
}

const Section = ({ title, items }: SectionProps) => (
  <section className="mb-9 flex w-full flex-col text-sm">
    <h2 className="uppercase leading-6 tracking-[2.8px] text-neutral-500">
      {title}
    </h2>
    <div className="mt-5 flex w-full flex-col gap-3 font-medium leading-4 text-black">
      {items.map((item, index) => (
        <Link
          className="text-lg font-semibold text-black"
          key={index}
          href={item.path ?? "/home"}
        >
          <div
            key={index}
            className="relative z-0 flex w-full flex-col leading-4"
          >
            <div className="z-10 flex items-center gap-2.5 pl-2.5">
              {item.icon}
              <div className="my-auto self-stretch text-sm">{item.title}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </section>
);

const OtherSection = () => (
  <section className="mt-8 flex w-full flex-col">
    <h2 className="uppercase leading-6 tracking-[2.8px] text-neutral-500">
      OTHER
    </h2>
    <div className="mt-5 flex w-full flex-col pl-7 text-sm leading-loose text-zinc-800">
      {otherMenuItems.map((item, index) => (
        <div key={index} className={index > 0 ? "mt-2.5" : ""}>
          {item}
        </div>
      ))}
    </div>
  </section>
);

export const Sidebar = () => {
  const workspaceItems = getWorkSpaceItems(iconConfig);
  const profileItems = getProfileSettingsItems(iconConfig);

  return (
    <nav className="flex w-full max-w-[286px] flex-col max-md:hidden">
      <Section title="My Profile" items={profileItems} />
      <Section title="Workspace" items={workspaceItems} />
      <OtherSection />
    </nav>
  );
};
