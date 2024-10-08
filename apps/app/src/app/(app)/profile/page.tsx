"use client";

import { useRef, useState } from "react";

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

import type { CustomInstructionsForm, ProfileForm } from "./types";
import { FileItem } from "./_components/file-item";
import { customInstructionsSchema, profileSchema } from "./types";

export default function ProfilePage() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm({
    schema: profileSchema,
    mode: "onChange",
  });

  const customInstructionForm = useForm({
    schema: customInstructionsSchema,
    mode: "onChange",
  });

  const onProfileSubmit = async (data: ProfileForm) => {
    const isStepValid = await profileForm.trigger();

    if (!isStepValid) {
      return;
    }

    console.log(data);
  };

  const onCustomInstructionSubmit = async (data: CustomInstructionsForm) => {
    const isStepValid = await profileForm.trigger();

    if (!isStepValid) {
      return;
    }
    console.log(data);
  };

  const onAddFiles = (files: FileList | undefined) => {
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
        <div className="mb-3">
          <h1 className="mb-2 text-2xl font-bold">Profile</h1>
          <h2 className="text-sm font-normal text-slate-300">
            Set up your personal preferences and custom instructions within your
            current workspace.
          </h2>
        </div>
        <Form {...profileForm}>
          <form
            className="flex w-full max-w-xl flex-col gap-6"
            onSubmit={profileForm.handleSubmit(onProfileSubmit)}
          >
            <FormField
              control={profileForm.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Full name" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={profileForm.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-600">
                    Role
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Role" />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </div>

      <div className="mb-4">
        <h1 className="text-xl font-bold">My Custom Instructions</h1>
        <h2 className="text-sm font-normal text-slate-300">
          These top instructions guide everything Mott does.
        </h2>
      </div>

      <Form {...customInstructionForm}>
        <form
          className="flex w-full max-w-2xl flex-col gap-9"
          onSubmit={customInstructionForm.handleSubmit(
            onCustomInstructionSubmit,
          )}
        >
          <FormField
            control={customInstructionForm.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                  Instructions
                </FormLabel>
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
            control={customInstructionForm.control}
            name="knowledge"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-600">
                  Knowledge
                  <h2 className="text-sm font-normal text-slate-300">
                    When you upload files under the Knowledge section, content
                    from those files may be referenced in conversations with
                    Mott.
                  </h2>
                </FormLabel>
                <FormControl>
                  <>
                    <Input
                      {...field}
                      ref={fileInputRef}
                      className="hidden"
                      type="file"
                      multiple
                      placeholder="Knowledge"
                      onChange={(e) => onAddFiles(e.target.files ?? undefined)}
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
                      className=""
                      onClick={handleSelectFiles}
                    >
                      Upload Files
                    </Button>
                  </>
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
