import type { Control } from "react-hook-form";

import { FormControl, FormField, FormItem, FormLabel } from "@mott/ui/form";
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
  label: string;
  placeholder: string;
  control: Control<Record<string, unknown>>;
  items: SelectItems[];
}

export const SettingsSelect = ({
  nameField,
  control,
  label,
  placeholder,
  items,
}: SettingsSelectProps) => {
  return (
    <FormField
      control={control}
      name={nameField}
      render={({ field }) => (
        <FormItem className="flex-1">
          <FormLabel className="text-neutral-900">{label}</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value as string}
            value={field.value as string}
          >
            <FormControl className="mt-2 flex h-10 gap-10 overflow-hidden whitespace-nowrap rounded-md border border-solid border-slate-200 bg-white px-3.5 py-2 text-base text-gray-700">
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
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
