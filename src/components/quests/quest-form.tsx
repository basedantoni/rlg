"use client";

import { Quests, insertQuestParams, NewQuestParams } from "@/db/schema/quests";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";

const QuestForm = ({
  quest,
  closeModal,
}: {
  quest?: Quests;
  closeModal?: () => void;
}) => {
  const editing = !!quest?.id;
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertQuestParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertQuestParams),
    defaultValues: quest ?? {
      title: "",
      description: "",
      dueDate: "",
      status: "open",
    },
  });

  const onSuccess = async (action: "create", data?: { error?: string }) => {
    if (data?.error) {
      toast(data.error);
      return;
    }

    await utils.quests.getQuests.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Quest ${action}d!`);
  };

  const { mutate: createQuest, isPending: isCreating } =
    trpc.quests.createQuest.useMutation({
      onSuccess: () => onSuccess("create"),
      onError: (err) => console.error("create", { error: err.message }),
    });

  const handleSubmit = (values: NewQuestParams) => {
    createQuest(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mr-1" disabled={isCreating}>
          {editing
            ? `Sav${isCreating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
      </form>
    </Form>
  );
};

export default QuestForm;
