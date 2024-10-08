import type { Control } from "react-hook-form";

import { FormControl, FormField, FormItem } from "@mott/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@mott/ui/select";

interface SelectItems {
  value: string;
  title: string;
}

interface SettingsSelectProps {
  nameField: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  control: Control<any>;
  items: SelectItems[];
}

export const SettingsSelect = ({
  nameField,
  control,
  items,
}: SettingsSelectProps) => {
  return (
    <FormField
      control={control}
      name={nameField}
      render={({ field }) => (
        <FormItem className="flex-1">
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string}
            value={field.value as string}
          >
            <FormControl className="mt-2 flex h-10 gap-10 overflow-hidden whitespace-nowrap rounded-md border border-solid border-slate-200 bg-white px-3.5 py-2 text-base text-gray-700">
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
            </FormControl>
            <SelectContent className="text-base">
              {items.map(({ value, title }) => (
                <SelectItem value={value} key={value}>
                  {title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
};
