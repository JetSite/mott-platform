"use client";

import type { FileInfo, UpdateWorkspaceInput } from "@mott/validators";
import { useEffect } from "react";

import { Button } from "@mott/ui/custom/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@mott/ui/form";
import { Input } from "@mott/ui/input";
import { toast } from "@mott/ui/toast";
import { UpdateWorkspaceSchema } from "@mott/validators";

import AvatarUploader from "~/components/ui/avatar-uploader";
import { useBoolean } from "~/hooks/use-boolean";
import { api } from "~/trpc/react";
import { RegionalSettings } from "./_components/regional-settings";

export default function SettingsPage() {
  const { data: workspace } = api.workspace.get.useQuery();
  const { mutateAsync: setLogo } = api.workspace.setLogo.useMutation();
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (workspace) {
      form.reset({
        name: workspace.name ?? "",
        settings: workspace.settings ?? {},
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workspace]);

  const loading = useBoolean();
  const { mutateAsync: updateWorkspace } = api.workspace.update.useMutation();
  const onSubmit = async (data: UpdateWorkspaceInput) => {
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }
    loading.onTrue();
    try {
      await updateWorkspace(data);
      toast.success("Settings saved");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error saving settings",
      );
    } finally {
      loading.onFalse();
    }
  };
  const handleLogoUpload = async (file: FileInfo) => {
    await setLogo({
      key: file.key,
      name: file.name,
      size: file.size,
      type: file.type,
    });
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
          <h3 className="font-semibold leading-none tracking-tight">Logo</h3>
          <AvatarUploader name="logo" onUploadComplete={handleLogoUpload} />
          <FormField
            control={form.control}
            name="settings.branding.assistant.name"
            render={({ field }) => (
              <FormItem className="mb-7">
                <FormLabel>Assistant`s Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Assistant's Name" />
                </FormControl>
              </FormItem>
            )}
          />
          <h3 className="font-semibold leading-none tracking-tight">
            Assistant`s Avatar
          </h3>
          <AvatarUploader name="assistantAvatar" rounded />

          <RegionalSettings control={form.control} />
          <Button type="submit" className="mt-6" loading={loading.value}>
            {loading.value ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
