"use client";

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from "@/components/ui/kibo-ui/kanban";
import { Spinner } from "@/components/ui/kibo-ui/spinner";
import { Checkbox } from "../ui/checkbox";

import type { DragEndEvent } from "@dnd-kit/core";
import { CompleteQuest } from "@/db/schema/quests";
import { Status } from "@/components/ui/kibo-ui/kanban";
import { ChangeEvent } from "react";

import { trpc } from "@/lib/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CheckedState = boolean | "indeterminate";

const QuestKanban = ({ quests }: { quests: CompleteQuest[] }) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = trpc.quests.getQuests.useQuery(undefined, {
    initialData: { quests },
    refetchOnMount: false,
  });

  const statuses: Status[] = [
    { id: "1", name: "open" },
    { id: "3", name: "completed" },
  ];

  const router = useRouter();
  const utils = trpc.useUtils();

  const onSuccess = async (action: "update", data?: { error?: string }) => {
    if (data?.error) {
      toast(data.error);
      return;
    }

    toast.success(`Quest Status Updated`);
  };

  const { mutate: updateQuest, isPending: isUpdating } =
    trpc.quests.updateQuest.useMutation({
      onMutate: async (updatedQuest) => {
        // Get the query key for the quests query
        const queryKey = getQueryKey(trpc.quests.getQuests);

        // Snapshot the previous state
        const previousCompleteQuests = utils.quests.getQuests.getData();

        // Optimistically update the cache by setting the new status for the card
        queryClient.setQueryData(queryKey, (oldQuests: CompleteQuest[]) => {
          if (!oldQuests) return oldQuests;

          return oldQuests.map((q) =>
            q.id === updatedQuest.id
              ? { ...q, status: updatedQuest.status }
              : q,
          );
        });

        return { previousCompleteQuests };
      },
      onError: (err, updatedQuest, context) => {
        if (context?.previousCompleteQuests) {
          const queryKey = getQueryKey(trpc.quests.getQuests);
          queryClient.setQueryData(queryKey, context.previousCompleteQuests);
        }
        toast.error("Something went wrong with this quest");
      },
      onSuccess: () => onSuccess("update"),
      onSettled: () => utils.quests.getQuests.invalidate(),
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

    data.quests.map((q) => {
      if (q.id === active.id && q.status !== status.name) {
        updateQuest({ ...q, status: status.name });
      }
    });
  };

  const handleChange = (q: CompleteQuest, checked: CheckedState) => {
    if (checked) {
      updateQuest({ ...q, status: "completed" });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <KanbanProvider className="max-w-[40rem]" onDragEnd={handleDragEnd}>
      {statuses.map((status) => (
        <KanbanBoard key={status.name} id={status.name}>
          <KanbanHeader
            name={status.name}
            count={data.quests.filter((q) => q.status === status.name).length}
          />
          <KanbanCards>
            {data.quests
              .filter((q) => q.status === status.name)
              .map((q: CompleteQuest, index: number) => (
                <KanbanCard
                  key={q.id}
                  id={q.id}
                  name={q.title}
                  parent={status.name}
                  index={index}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id="completed"
                    defaultChecked={status.name === "completed"}
                    disabled={status.name === "completed"}
                    onCheckedChange={(checked) => handleChange(q, checked)}
                  />
                  <label htmlFor="complete">{q.title}</label>
                </KanbanCard>
              ))}
          </KanbanCards>
        </KanbanBoard>
      ))}
    </KanbanProvider>
  );
};

export default QuestKanban;
