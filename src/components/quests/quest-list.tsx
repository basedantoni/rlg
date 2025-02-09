"use client";

import QuestModal from "@/components/quests/quest-modal";
import QuestForm from "@/components/quests/quest-form";

import { CompleteQuest } from "@/db/schema/quests";
import { useState } from "react";
import { trpc } from "@/lib/trpc/client";

import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

const Quest = ({ quest }: { quest: CompleteQuest }) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Badge
          className="flex justify-between px-2.5 py-2 w-36 cursor-pointer hover:bg-muted"
          variant="outline"
        >
          <p>{quest.title}</p>
          <div className="h-1 w-1 rounded-full bg-primary"></div>
        </Badge>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>Edit Quest</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <QuestForm closeModal={closeModal} quest={quest} />
        </div>
      </DialogContent>
    </Dialog>
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
