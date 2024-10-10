"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@mott/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  useForm,
} from "@mott/ui/form";

import type { CompanyChatPlatformForm } from "../types";
import { useSignUpFormContext } from "../signup-form-context";
import { companyChatPlatform } from "../types";

interface ChatPlatform {
  name: string;
  img: string;
}

const platforms: ChatPlatform[] = [
  { name: "Slack", img: "/assets/slack.png" },
  { name: "Microsoft Teams", img: "/assets/teams.png" },
  { name: "Google Chat", img: "/assets/google.png" },
  { name: "WhatsApp", img: "/assets/whatsapp.png" },
  { name: "iMessage", img: "/assets/imessage.png" },
];

export default function CorporateChatPage() {
  const router = useRouter();

  const form = useForm({
    schema: companyChatPlatform,
    mode: "onSubmit",
  });

  const { updateFormValues } = useSignUpFormContext();

  const onSubmit = async (data: CompanyChatPlatformForm) => {
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }

    updateFormValues(data);
    router.push("/signup/congratulation");
  };

  const handleSelectPlatform = async (name: string) => {
    form.setValue("companyChatPlatform", name);
    await form.handleSubmit(onSubmit)();
  };

  const handleBack = () => {
    router.push("/signup/your-company");
  };

  return (
    <>
      <div className="mb-6 mt-[-80px]">
        <h1 className="text-3xl font-bold tracking-tight">Corporate Chat</h1>
        <h2 className="text-lg font-semibold tracking-tight text-neutral-400">
          Please select the chat platform your company uses for communication.
        </h2>
      </div>
      <Form {...form}>
        <form
          className="mt-[100px] flex w-full max-w-2xl flex-col gap-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <>
            {platforms.map((platform) => (
              <FormField
                key={platform.name}
                control={form.control}
                name="companyChatPlatform"
                render={() => (
                  <FormItem
                    className="cursor-pointer rounded-lg border p-2 pl-28"
                    onClick={() => handleSelectPlatform(platform.name)}
                  >
                    <div className="flex items-center gap-3">
                      <FormControl>
                        <Image
                          src={platform.img}
                          width={26}
                          height={26}
                          alt="Slack"
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-medium text-gray-600">
                        {platform.name}
                      </FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            ))}
          </>
        </form>
      </Form>
      <Button
        size="lg"
        variant="ghost"
        aria-label="Back"
        className="mt-2 w-full"
        onClick={handleBack}
      >
        Back
      </Button>
    </>
  );
}
