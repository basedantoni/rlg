"use client";

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/roadmap-ui/kanban";
import { trpc } from "@/lib/trpc/client";
import type { DragEndEvent } from "@dnd-kit/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Card {
  id: string;
  title: string;
  status: "open" | "completed";
  dueDate: string;
}

const Kanban = ({ cards }: { cards: Card[] }) => {
  const statuses = [
    { id: "1", name: "open", color: "red" },
    { id: "3", name: "completed", color: "green" },
  ];

  const router = useRouter();
  const utils = trpc.useUtils();

  const onSuccess = async (action: "update", data?: { error?: string }) => {
    if (data?.error) {
      toast(data.error);
      return;
    }

    await utils.quests.getQuests.invalidate();
    router.refresh();
    toast.success(`Quest Status Updated`);
  };

  const { mutate: updateQuest, isPending: isUpdating } =
    trpc.quests.updateQuest.useMutation({
      onSuccess: () => onSuccess("update"),
      onError: (err) => console.error("update", { error: err.message }),
    });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statuses.find((status) => status.name === over.id);

    if (!status) {
      return;
    }

    cards.map((c) => {
      if (c.id === active.id && c.status !== status.name) {
        updateQuest({ ...c, status: status.name });
      }
    });
  };

  return (
    <KanbanProvider onDragEnd={handleDragEnd}>
      {statuses.map((status) => (
        <KanbanBoard key={status.name} id={status.name}>
          <KanbanHeader name={status.name} color={status.color} />
          <KanbanCards>
            {cards
              .filter((c) => c.status === status.name)
              .map((c: Card, index: number) => (
                <KanbanCard
                  key={c.id}
                  id={c.id}
                  name={c.title}
                  parent={status.name}
                  index={index}
                >
                  <p>{c.title}</p>
                </KanbanCard>
              ))}
          </KanbanCards>
        </KanbanBoard>
      ))}
    </KanbanProvider>
  );
};

export default Kanban;
