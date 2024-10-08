import { ConnectionBanner } from "./_components/connection-banner";
import { HomeHeader } from "./_components/home-header";
import { options, settings } from "./_components/menuItems";
import { OptionItem } from "./_components/option-item";

export default function UserHomePage() {
  return (
    <div className="m-auto flex h-full max-w-[512px] flex-col pb-6 pl-5 pr-3">
      <HomeHeader />
      <ConnectionBanner />

      <div className="mb-14">
        <h1 className="mb-3 text-2xl font-bold">Hi, Greg Dredger!</h1>
        <h2 className="text-sm font-medium text-slate-300">
          Adjust and personalize the settings of your workspace, including
          managing connections, user access, and other customization options.
        </h2>
      </div>

      <div className="mb-14 flex-col marker:flex">
        <span className="text-sm font-semibold text-black">
          Personalize your settings within the workspace.
        </span>

        <div className="mt-[14px] flex flex-col gap-6">
          {settings.map((setting) => (
            <OptionItem
              key={setting.title}
              icon={setting.icon}
              title={setting.title}
              subtitle={setting.subtitle}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col">
        <span className="mb-5 text-sm font-semibold text-black">
          Tailor your workspace to fit your needs with advanced customization
          options.
        </span>
        <div className="flex flex-col gap-6">
          {options.map((option) => (
            <OptionItem
              key={option.title}
              icon={option.icon}
              title={option.title}
              subtitle={option.subtitle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
