import type { Control } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel } from "@mott/ui/form";
import { RadioGroup, RadioGroupItem } from "@mott/ui/radio-group";

interface SelectItems {
  value: string;
  title: string;
}

interface SettingsRadioGroupProps {
  nameField: string;
  label: string;
  control: Control<Record<string, unknown>>;
  items: SelectItems[];
}

export const SettingsRadioGroup = ({
  control,
  nameField,
  label,
  items,
}: SettingsRadioGroupProps) => {
  return (
    <FormField
      control={control}
      name={nameField}
      render={({ field }) => (
        <FormControl className="min-h-[44px] flex-wrap items-center justify-between rounded-md border border-solid border-slate-200 px-3">
          <RadioGroup
            onValueChange={(value) => {
              field.onChange(value);
            }}
            defaultValue={field.value as string}
            value={field.value as string}
            className="flex gap-4"
          >
            <FormLabel className="ttext-black text-sm font-medium">
              {label}
            </FormLabel>

            <div className="flex items-center justify-between gap-5">
              {items.map((field) => {
                return (
                  <FormItem
                    key={field.value}
                    className="flex items-center justify-center gap-2"
                  >
                    <FormControl className="shrink-0">
                      <RadioGroupItem value={field.value} />
                    </FormControl>
                    <FormLabel className="cursor-pointer pb-2 font-normal text-black">
                      {field.title}
                    </FormLabel>
                  </FormItem>
                );
              })}
            </div>
          </RadioGroup>
        </FormControl>
      )}
    />
  );
};
