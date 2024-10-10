import {
  getProfileSettingsItems,
  getWorkSpaceItems,
} from "../_components/menu-items";
import { ConnectionBanner } from "./_components/connection-banner";
import { OptionItem } from "./_components/option-item";

const iconConfig = {
  width: 31,
  height: 31,
  color: "#D4D4D4",
  className: "flex-shrink-0",
};

export default function UserHomePage() {
  const options = getWorkSpaceItems(iconConfig);
  const settings = getProfileSettingsItems(iconConfig);

  return (
    <div>
      <ConnectionBanner />
      <div className="mb-14">
        <h1 className="mb-3 text-2xl font-bold">Hi, Greg Dredger!</h1>
        <h2 className="text-sm font-medium text-neutral-400">
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
              path={setting.path ?? "/home"}
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
              path={option.path ?? "/home"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
