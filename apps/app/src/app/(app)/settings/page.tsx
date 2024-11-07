"use client";

import type { UpdateWorkspaceInput } from "@mott/validators";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@mott/ui/form";
import { Input } from "@mott/ui/input";
import { UpdateWorkspaceSchema } from "@mott/validators";

import { ImageInput } from "./_components/image-input";
import { RegionalSettings } from "./_components/regional-settings";

const DEFAULT_LOGO = "/assets/hims.png";
const DEFAULT_ASSISTANTS_AVATAR = "/assets/assistantsAvatar.png";

export default function SettingsPage() {
  const form = useForm({
    schema: UpdateWorkspaceSchema,
    mode: "onChange",
    defaultValues: {
      name: "",
      settings: {
        branding: {
          assistant: {
            name: "",
          },
        },
      },
    },
  });

  const onSubmit = async (data: UpdateWorkspaceInput) => {
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
        <h2 className="text-sm font-normal text-neutral-500">
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
            name="name"
            render={({ field }) => (
              <FormItem className="mb-7">
                <FormLabel>Workspace Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Workspace Name" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="settings.branding.logoFileId"
            render={() => (
              <FormItem className="mb-7">
                <FormLabel>Logo</FormLabel>
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
            name="settings.branding.assistant.name"
            render={({ field }) => (
              <FormItem className="mb-7">
                <FormLabel>Assistant`s Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Assistant’s Name" />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="settings.branding.assistant.avatarFileId"
            render={() => (
              <FormItem className="mb-10">
                <FormLabel>Assistant`s Avatar</FormLabel>
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

          <RegionalSettings control={form.control} />
        </form>
      </Form>
    </div>
  );
}
