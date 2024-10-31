"use client";

import type { ProfileUpdateForm } from "@mott/validators";
import { useEffect, useRef, useState } from "react";

import { Button } from "@mott/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@mott/ui/form";
import { Input } from "@mott/ui/input";
import { Textarea } from "@mott/ui/textarea";
import { toast } from "@mott/ui/toast";
import { ProfileUpdateSchema } from "@mott/validators";

import { FileItem } from "~/components/forms/file-item";
import { api } from "~/trpc/react";

export default function ProfilePage() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: updateProfile } = api.profile.update.useMutation();
  const { data: profile } = api.profile.get.useQuery();
  const form = useForm({
    schema: ProfileUpdateSchema,
    mode: "onChange",
    defaultValues: {
      name: "",
      jobRole: "",
      instructions: "",
      knowledge: "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset(profile);
    }
  }, [profile, form]);

  const onSubmit = async (data: ProfileUpdateForm) => {
    const isValid = await form.trigger();

    if (!isValid) {
      return;
    }

    try {
      await updateProfile(data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Profile update error:", error);
    }
  };

  const onAddFiles = (files: FileList | null) => {
    if (!files) {
      return;
    }

    setFiles((prev) => [...prev, ...files]);
  };

  const handleSelectFiles = () => {
    if (!fileInputRef.current) {
      return;
    }

    fileInputRef.current.click();
  };

  const handleDeleteFile = (name: string) => {
    setFiles((prev) => prev.filter((file) => file.name !== name));
  };

  return (
    <div>
      <div className="mb-8">
        <div className="mb-8">
          <h1 className="mb-3 text-2xl font-semibold">Profile</h1>
          <h2 className="text-sm font-normal text-neutral-400">
            Set up your personal preferences and custom instructions within your
            current workspace.
          </h2>
        </div>

        <Form {...form}>
          <form
            className="flex w-full max-w-2xl flex-col gap-6"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Full name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="jobRole"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input placeholder="Role" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mb-4">
              <h1 className="text-lg font-semibold">My Custom Instructions</h1>
              <h2 className="text-sm font-normal text-neutral-400">
                These top instructions guide everything Mott does.
              </h2>
            </div>

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Instructions"
                      className="h-[160px] resize-none"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="knowledge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Knowledge
                    <h2 className="mb-3 text-sm font-normal text-neutral-500">
                      When you upload files under the Knowledge section, content
                      from those files may be referenced in conversations with
                      Mott.
                    </h2>
                  </FormLabel>
                  <FormControl>
                    <div>
                      <Input
                        {...field}
                        ref={fileInputRef}
                        className="hidden"
                        type="file"
                        multiple
                        placeholder="Knowledge"
                        onChange={(e) => onAddFiles(e.target.files)}
                      />
                      {files.map((file) => (
                        <FileItem
                          key={file.name}
                          file={file}
                          onDelete={handleDeleteFile}
                        />
                      ))}

                      <Button
                        variant="outline"
                        size="md"
                        aria-label="Connect"
                        onClick={handleSelectFiles}
                      >
                        Upload Files
                      </Button>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3">
              <Button variant="outline" size="md" aria-label="Cancel">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                aria-label="Save"
                className="w-full max-w-[143px]"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
