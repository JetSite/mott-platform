import type { Control } from "react-hook-form";

import { SettingsRadioGroup } from "./settings-radio-group";
import { SettingsSelect } from "./settings-select";

const countries = [
  { title: "United States", value: "United States" },
  { title: "Germany", value: "Germany" },
  { title: "Italy", value: "Italy" },
];

const timeZones = [
  { title: "New York", value: "New York" },
  { title: "London", value: "London" },
  { title: "Tokio", value: "Tokio" },
];

const calendarTypes = [
  { title: "Gregorian", value: "Gregorian" },
  { title: "Julian", value: "Julian" },
];

const days = [
  { title: "Monday", value: "Monday" },
  { title: "Tuesday", value: "Tuesday" },
  { title: "Wednesday", value: "Wednesday" },
  { title: "Thursday", value: "Thursday" },
  { title: "Friday", value: "Friday" },
  { title: "Sunday", value: "Sunday" },
];

const dateFormats = [
  { title: "YYYY-MM-DD", value: "YYYY-MM-DD" },
  { title: "MM/DD/YYYY", value: "MM/DD/YYYY" },
  { title: "DD-MMM-YYYY", value: "DD-MMM-YYYY" },
];

const numberFormats = [
  { title: "12,345", value: "12,345" },
  { title: "1.23E+4", value: "1.23E+4" },
  { title: "12345", value: "12345" },
];

const temperatures = [
  { title: "Celsius (°C)", value: "C" },
  { title: "Fahrenheit (°F)", value: "F" },
];

const currency = [
  { title: "$", value: "USD" },
  { title: "£", value: "GBP" },
  { title: "€", value: "EUR" },
];

const languages = [
  { title: "English", value: "English" },
  { title: "German", value: "German" },
  { title: "Italian", value: "Italian" },
];

const measurementSystems = [
  { title: "Metric", value: "Metric" },
  { title: "US", value: "US" },
  { title: "UK", value: "UK" },
];

interface RegionalSettingsProps {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  control: Control<any>;
}

export const RegionalSettings = ({ control }: RegionalSettingsProps) => {
  return (
    <>
      <h1 className="mb-3 text-lg font-semibold">Regional Settings</h1>
      <div className="flex flex-wrap gap-x-10 gap-y-4">
        <SettingsSelect
          control={control}
          items={countries}
          nameField="region"
          label="Region"
          placeholder="Select region"
        />

        <SettingsSelect
          control={control}
          items={timeZones}
          nameField="timezone"
          label="Time Zone"
          placeholder="Select Time zone"
        />

        <div className="flex w-full flex-col gap-4">
          <SettingsSelect
            control={control}
            items={calendarTypes}
            nameField="calendar"
            label="Calendar"
            placeholder="Select Calendar"
          />

          <SettingsRadioGroup
            control={control}
            items={temperatures}
            nameField="temperature"
            label="Temperature"
          />

          <SettingsRadioGroup
            control={control}
            items={measurementSystems}
            nameField="measurementSystem"
            label="Measurement system"
          />
        </div>

        <SettingsSelect
          control={control}
          items={days}
          nameField="dayOfWeek"
          label="First day of week"
          placeholder="Select First day of week"
        />

        <SettingsSelect
          control={control}
          items={dateFormats}
          nameField="dateFormat"
          label="Date format"
          placeholder="Select Date format"
        />

        <SettingsSelect
          control={control}
          items={numberFormats}
          nameField="numberFormat"
          label="Number format"
          placeholder="Select Number format"
        />

        <SettingsSelect
          control={control}
          items={currency}
          nameField="currency"
          label="Currency"
          placeholder="Select Currency"
        />

        <SettingsSelect
          control={control}
          items={languages}
          nameField="language"
          label="Language"
          placeholder="The language of your organization?"
        />

        <SettingsSelect
          control={control}
          items={languages}
          nameField="secondLanguage"
          label="Additional Language (optional)"
          placeholder="Choose additional language"
        />
      </div>
    </>
  );
};
