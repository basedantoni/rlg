"use client";

import { Badge } from "@/components/ui/badge";

import { Quests } from "@/db/schema/quests";

const Quest = (quest: Quests) => {
  return <Badge>{quest.title}</Badge>;
};

const QuestList = (quests: Array<Quests>) => {
  return (
    <div className="flex gap-4">
      {quests.map((q) => (
        <Quest quest={q} />
      ))}
    </div>
  );
};

export default QuestList;
