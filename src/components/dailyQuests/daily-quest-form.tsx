"use client";

import {
  DailyQuests,
  insertDailyQuestParams,
  NewDailyQuestParams,
} from "@/db/schema/dailyQuests";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "../ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectTrigger, SelectItem } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { toast } from "sonner";
import { capitalize, cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { CompleteQuest } from "@/db/schema/quests";

const DailyQuestForm = ({
  dailyQuest,
  closeModal,
}: {
  dailyQuest?: DailyQuests;
  closeModal?: () => void;
}) => {
  const editing = !!dailyQuest?.id;
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertDailyQuestParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertDailyQuestParams),
    defaultValues: dailyQuest
      ? {
          ...dailyQuest,
          dueDate: dailyQuest.dueDate,
        }
      : {
          title: "",
          description: "",
          dueDate: null, // or new Date() if you prefer a default date
          recurrence: "none",
          questId: null,
        },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
    if (data?.error) {
      toast(data.error);
      return;
    }

    await utils.dailyQuests.getDailyQuests.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Daily Quest ${capitalize(action)}d`);
  };

  const { mutate: createQuest, isPending: isCreating } =
    trpc.dailyQuests.createDailyQuest.useMutation({
      onSuccess: () => onSuccess("create"),
      onError: (err: { message: string }) =>
        console.error("create", { error: err.message }),
    });

  const { mutate: updateQuest, isPending: isUpdating } =
    trpc.dailyQuests.updateDailyQuest.useMutation({
      onSuccess: () => onSuccess("update"),
      onError: (err: { message: string }) =>
        console.error("update", { error: err.message }),
    });

  const handleSubmit = (values: NewDailyQuestParams) => {
    if (editing) {
      updateQuest({ ...values, id: dailyQuest.id });
    } else {
      createQuest(values);
    }
  };

  const { data: q } = trpc.quests.getQuests.useQuery();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-4"}>
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
        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Due Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex justify-between font-normal",
                        !field.value && "text-muted-foreground",
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon size={14} />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={(date) => {
                      const dateString = date ? date.toISOString() : null;
                      field.onChange(dateString);
                    }}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="questId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quest</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose Quest" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {q?.quests.map((q: CompleteQuest) => (
                    <SelectItem key={q.id} value={q.id}>
                      {q.title}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage />
              </Select>
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

export default DailyQuestForm;
