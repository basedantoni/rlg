"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewQuest } from "@/db/schema/quests";
import { Input } from "../ui/input";
import { useState } from "react";
import { useOnboardingContext } from "@/context/onboarding";
import { NewDailyQuest } from "@/db/schema/dailyQuests";

export default function SetupForm() {
  const { quests, updateQuests } = useOnboardingContext();
  const [newQuestTitle, setNewQuestTitle] = useState<string>("");

  const handleAddQuest = (q: NewQuest) => {
    updateQuests(q);
    setNewQuestTitle("");
  };

  const { dailyQuests, updateDailyQuests } = useOnboardingContext();
  const [newDailyQuestTitle, setNewDailyQuestTitle] = useState<string>("");

  const handleAddDailyQuest = (q: NewDailyQuest) => {
    updateDailyQuests(q);
    setNewDailyQuestTitle("");
  };
  return (
    <div className="flex flex-col gap-10 self-stretch">
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col gap-2.5">
          <p className="text-xl font-semibold">
            Main Quests <span className="text-sm font-normal">(max 5)</span>
          </p>
          <p className="text-sm">
            Set your main quests plus the side quests that will help you succeed
            along the way.
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center w-full relative">
          {quests
            .slice(0, 5)
            .map(({ title }: { title: string }, idx: number) => (
              <div
                key={idx}
                className="bg-white h-4 absolute flex gap-2.5 px-4 py-1 items-center w-full border rounded-lg"
                style={{
                  transform: `translateY(-${0.5 * (idx + 1.25)}rem) scaleX(${1 - (idx + 1) * 0.03})`,
                  zIndex: `-${idx * 10}`,
                }}
              ></div>
            ))}
          <Input
            className="z-20 bg-white px-4 py-3 rounded-lg"
            type="text"
            placeholder="Quest Title"
            value={newQuestTitle}
            onChange={(e) => setNewQuestTitle(e.target.value)}
          />
          <Button
            onClick={() => handleAddQuest({ title: newQuestTitle })}
            disabled={quests.length >= 5 || newQuestTitle.length <= 0}
            className="w-full"
          >
            <Plus />
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-center gap-12">
        <div className="flex flex-col gap-2.5">
          <p className="text-xl font-semibold">Side Quests </p>
          <p className="text-sm">
            Set your main quests plus the side quests that will help you succeed
            along the way.
          </p>
        </div>
        <div className="flex flex-col gap-3 items-center w-full">
          <div className="flex flex-col gap-3 items-center w-full relative">
            {dailyQuests
              .slice(0, 5)
              .map(({ title }: { title: string }, idx: number) => (
                <div
                  key={idx}
                  className="bg-white h-4 absolute flex gap-2.5 px-4 py-1 items-center w-full border rounded-lg"
                  style={{
                    transform: `translateY(-${0.5 * (idx + 1.25)}rem) scaleX(${1 - (idx + 1) * 0.03})`,
                    zIndex: `-${idx * 10}`,
                  }}
                ></div>
              ))}
            <Input
              className="z-20 bg-white px-4 py-3 rounded-lg"
              type="text"
              placeholder="Side Quest Title"
              value={newDailyQuestTitle}
              onChange={(e) => setNewDailyQuestTitle(e.target.value)}
            />
            <Button
              onClick={() => handleAddDailyQuest({ title: newDailyQuestTitle })}
              disabled={
                dailyQuests.length > 20 || newDailyQuestTitle.length <= 0
              }
              className="w-full"
            >
              <Plus />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
