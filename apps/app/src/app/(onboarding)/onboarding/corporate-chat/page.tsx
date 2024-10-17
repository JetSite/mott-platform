"use client";

import type { CorporateChat } from "@mott/db/schema";
import type { CorporateChatForm } from "@mott/validators";
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
import { toast } from "@mott/ui/toast";
import { corporateChatSchema } from "@mott/validators";

import { useBoolean } from "~/hooks/use-boolean";
import { paths } from "~/routes/paths";
import { api } from "~/trpc/react";

interface ChatPlatform {
  code: CorporateChat;
  name: string;
  img: string;
}

const platforms: ChatPlatform[] = [
  { code: "slack", name: "Slack", img: "/assets/slack.png" },
  { code: "teams", name: "Microsoft Teams", img: "/assets/teams.png" },
  { code: "google", name: "Google Chat", img: "/assets/google.png" },
  { code: "whatsapp", name: "WhatsApp", img: "/assets/whatsapp.png" },
  { code: "imessage", name: "iMessage", img: "/assets/imessage.png" },
];

export default function CorporateChatPage() {
  const router = useRouter();
  const loading = useBoolean();
  const { mutateAsync: saveCorporateChat } =
    api.auth.saveCorporateChat.useMutation();

  const form = useForm({
    schema: corporateChatSchema,
    mode: "onSubmit",
  });

  const onSubmit = async (data: CorporateChatForm) => {
    const isStepValid = await form.trigger();

    if (!isStepValid) {
      return;
    }

    try {
      loading.onTrue();
      await saveCorporateChat({ corporateChat: data.corporateChat });
    } catch (error) {
      console.error("Error saving corporate chat:", error);
      toast.error("Error saving corporate chat");
    }

    router.push(paths.onboarding.congratulations);
  };

  const handleSelectPlatform = async (code: CorporateChat) => {
    form.setValue("corporateChat", code);
    await form.handleSubmit(onSubmit)();
  };

  const handleBack = () => {
    router.push(paths.onboarding.companySetup);
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
          {platforms.map((platform) => (
            <FormField
              key={platform.name}
              control={form.control}
              name="corporateChat"
              render={() => (
                <FormItem
                  className="cursor-pointer rounded-lg border p-2 pl-28"
                  onClick={() => handleSelectPlatform(platform.code)}
                >
                  <div className="flex items-center gap-3">
                    <FormControl>
                      <Image
                        src={platform.img}
                        width={26}
                        height={26}
                        alt={platform.name}
                        unoptimized
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
