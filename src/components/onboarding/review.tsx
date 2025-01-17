"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components//ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";
import { toast } from "sonner";

import { NewQuestParams } from "@/db/schema/quests";
import { NewDailyQuestParams } from "@/db/schema/dailyQuests";
import { useOnboardingContext } from "@/context/onboarding";
import { trpc } from "@/lib/trpc/client";

export default function Review() {
  const { quests, dailyQuests } = useOnboardingContext();

  const utils = trpc.useUtils();
  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string },
  ) => {
    if (data?.error) {
      toast.error(data.error);
      console.log(data.error);
      return;
    }

    toast.error(
      `${action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()} event`,
    );
    await utils.quests.getQuests.invalidate();
  };

  const { mutate: createQuest } = trpc.quests.createQuest.useMutation({
    onSuccess: () => onSuccess("create"),
    onError: (err) => console.error("create", { error: err.message }),
  });

  const { mutate: createDailyQuest } =
    trpc.dailyQuests.createDailyQuest.useMutation({
      onSuccess: () => onSuccess("create"),
      onError: (err) => console.error("create", { error: err.message }),
    });

  const handleBatchSubmit = async () => {
    try {
      await Promise.all(
        quests.map(async (q: NewQuestParams) => {
          return createQuest(q);
        }),
      );
    } catch (error) {
      console.error("Error creating quests:", error);
    }

    try {
      await Promise.all(
        dailyQuests.map(async (d: NewDailyQuestParams) => {
          return createDailyQuest(d);
        }),
      );
    } catch (error) {
      console.error("Error creating quests:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review and finish</CardTitle>
        <CardDescription>
          Review your quests and side quests (you can edit them later)
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <ScrollArea className="h-[28rem] px-5 rounded-lg overflow-y-scroll">
          {quests.length > 0 && (
            <div className="flex flex-col">
              <p className="font-semibold">Quests</p>
              {quests.map(({ title }: { title: string }, idx: number) => (
                <div
                  className="py-4 last:border-none border-b border-secondary"
                  key={idx}
                >
                  <p className="font-medium text-sm">{title}</p>
                </div>
              ))}
            </div>
          )}
          {dailyQuests.length > 0 && (
            <div className="flex flex-col">
              <p className="font-semibold">Side Quests</p>
              {dailyQuests.map(({ title }: { title: string }, idx: number) => (
                <div
                  className="flex justify-between py-4 last:border-none border-b border-secondary"
                  key={idx}
                >
                  <p className="font-medium text-sm">{title}</p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleBatchSubmit}
          disabled={quests.length <= 0}
          className="w-full"
        >
          Complete Setup
        </Button>
      </CardFooter>
    </Card>
  );
}
