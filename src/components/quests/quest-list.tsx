"use client";

import { Badge } from "@/components/ui/badge";
import QuestModal from "./quest-modal";

import { CompleteQuest } from "@/db/schema/quests";
import { trpc } from "@/lib/trpc/client";

const Quest = ({ quest }: { quest: CompleteQuest }) => {
  return (
    <Badge className="flex justify-between w-36" variant="outline">
      <p>{quest.title}</p>
      <div className="h-1 w-1 rounded-full bg-primary"></div>
    </Badge>
  );
};

const QuestList = ({ quests }: { quests: CompleteQuest[] }) => {
  const { data: q } = trpc.quests.getQuests.useQuery(undefined, {
    initialData: { quests },
    refetchOnMount: false,
  });

  if (q.quests.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="flex gap-4">
      {q.quests.map((q) => (
        <Quest key={q.id} quest={q} />
      ))}
      <QuestModal />
    </div>
  );
};

const EmptyState = () => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No quests
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new quest.
      </p>
      <div className="mt-6">
        <QuestModal />
      </div>
    </div>
  );
};

export default QuestList;
