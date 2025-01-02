"use client";

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/roadmap-ui/kanban";
import type { DragEndEvent } from "@dnd-kit/core";
import { useState } from "react";
import type { FC } from "react";

export const Kanban: FC = () => {
  const statuses = [
    { id: "1", name: "planned", color: "red" },
    { id: "2", name: "in progress", color: "blue" },
    { id: "3", name: "done", color: "green" },
  ];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statuses.find((status) => status.name === over.id);

    if (!status) {
      return;
    }
  };

  return (
    <KanbanProvider onDragEnd={handleDragEnd}>
      {statuses.map((status) => (
        <KanbanBoard key={status.name} id={status.name}>
          <KanbanHeader name={status.name} color={status.color} />
        </KanbanBoard>
      ))}
    </KanbanProvider>
  );
};
