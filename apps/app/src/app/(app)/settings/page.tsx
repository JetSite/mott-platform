"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@mott/ui/form";
import { Input } from "@mott/ui/input";

import type { SettingsForm } from "./types";
import { ImageInput } from "./_components/image-input";
import { SettingsSelect } from "./_components/settings-select";
import { settingsSchema } from "./types";

const DEFAULT_LOGO = "/assets/avatar.png";
const DEFAULT_ASSISTANTS_AVATAR = "/assets/assistantsAvatar.png";

const countries = [
  { title: "United States", value: "United States" },
  { title: "Germany", value: "Germany" },
  { title: "Italy", value: "Italy" },
];

const languages = [
  { title: "English", value: "English" },
  { title: "German", value: "German" },
  { title: "Italian", value: "Italian" },
];

export default function SettingsPage() {
  const form = useForm({
    schema: settingsSchema,
    mode: "onChange",
  });

  const onSubmit = async (data: SettingsForm) => {
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }

    console.log(data);
  };

  return (
    <div>
      <div className="mb-7">
        <h1 className="mb-3 text-2xl font-semibold">Workspace Settings</h1>
        <h2 className="text-sm font-medium text-gray-400">
          Customize your workspace by adjusting the name, icon, country,
          language, and other preferences to enhance usability and
          personalization.
        </h2>
      </div>

      <h1 className="mb-3 text-lg font-semibold">General Settings</h1>
      <Form {...form}>
        <form
          className="flex w-full max-w-2xl flex-col"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="workspaceName"
            render={({ field }) => (
              <FormItem className="mb-7">
                <FormLabel className="text-sm font-medium text-gray-600">
                  Workspace Name
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Workspace Name" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="logo"
            render={() => (
              <FormItem className="mb-7">
                <FormLabel className="text-sm font-medium text-gray-600">
                  Logo
                </FormLabel>
                <FormControl>
                  <ImageInput
                    defaultLogo={DEFAULT_LOGO}
                    title="Upload Logo"
                    placeholder="Logo"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assistantName"
            render={({ field }) => (
              <FormItem className="mb-7">
                <FormLabel className="text-sm font-medium text-gray-600">
                  Assistant`s Name
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Assistant’s Name" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="assistantLogo"
            render={() => (
              <FormItem className="mb-10">
                <FormLabel className="text-sm font-medium text-gray-600">
                  Assistant`s Avatar
                </FormLabel>
                <FormControl>
                  <ImageInput
                    defaultLogo={DEFAULT_ASSISTANTS_AVATAR}
                    title="Upload Logo"
                    placeholder="Assistant`s Avatar"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <h1 className="mb-3 text-lg font-semibold">Country & Language</h1>
          <div className="flex flex-wrap gap-4">
            <SettingsSelect
              nameField="country"
              control={form.control}
              items={countries}
            />

            <SettingsSelect
              nameField="language"
              control={form.control}
              items={languages}
            />
          </div>
        </form>
      </Form>
    </div>
  );
}
