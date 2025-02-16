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
import { Calendar, RefreshCw } from "lucide-react";
import DailyQuestModal from "./daily-quest-modal";

import type { DragEndEvent } from "@dnd-kit/core";
import { CompleteDailyQuest } from "@/db/schema/dailyQuests";
import { Status } from "@/components/ui/kibo-ui/kanban";

import { getDueDateColor, formatDueDate } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type CheckedState = boolean | "indeterminate";

const DailyQuestKanban = ({
  dailyQuests,
}: {
  dailyQuests: CompleteDailyQuest[];
}) => {
  const queryClient = useQueryClient();

  const { data, isLoading } = trpc.dailyQuests.getDailyQuests.useQuery(
    undefined,
    {
      initialData: { dailyQuests },
      refetchOnMount: false,
    },
  );

  const statuses: Status[] = [
    { id: "1", name: "open" },
    { id: "3", name: "completed" },
  ];

  const router = useRouter();
  const utils = trpc.useUtils();

  const onSuccess = async (
    action: "update" | "complete",
    data?: { error?: string },
  ) => {
    if (data?.error) {
      toast(data.error);
      return;
    }

    toast.success(`Daily Quest Status Updated`);
  };

  const { mutate: updateQuest, isPending: isUpdating } =
    trpc.dailyQuests.updateDailyQuest.useMutation({
      onMutate: async (updatedQuest) => {
        // Get the query key for the quests query
        const queryKey = getQueryKey(trpc.quests.getQuests);

        // Snapshot the previous state
        const previousQuests = utils.quests.getQuests.getData();

        // Optimistically update the cache by setting the new status for the card
        queryClient.setQueryData(
          queryKey,
          (oldQuests: CompleteDailyQuest[]) => {
            if (!oldQuests) return oldQuests;

            return oldQuests.map((q) =>
              q.id === updatedQuest.id
                ? { ...q, status: updatedQuest.status }
                : q,
            );
          },
        );

        return { previousQuests };
      },
      onError: (err, updatedQuest, context) => {
        if (context?.previousQuests) {
          const queryKey = getQueryKey(trpc.quests.getQuests);
          queryClient.setQueryData(queryKey, context.previousQuests);
        }
        toast.error("Something went wrong with this quest");
      },
      onSuccess: () => onSuccess("update"),
      onSettled: () => utils.dailyQuests.getDailyQuests.invalidate(),
    });

  const { mutate: completeQuest } =
    trpc.dailyQuests.completeDailyQuest.useMutation({
      onSuccess: () => onSuccess("complete"),
      onSettled: () => utils.dailyQuests.invalidate(),
      onError: (err) => console.error("complete", { error: err.message }),
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

    data.dailyQuests.map((q) => {
      if (q.id === active.id && q.status !== status.name) {
        over.id === "completed"
          ? completeQuest({ ...q })
          : updateQuest({ ...q, status: status.name });
      }
    });
  };

  const handleChange = (q: CompleteDailyQuest, checked: CheckedState) => {
    if (checked) {
      completeQuest({ ...q });
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <KanbanProvider onDragEnd={handleDragEnd}>
      {statuses.map((status) => (
        <KanbanBoard key={status.name} id={status.name}>
          <KanbanHeader
            className="capitalize"
            name={status.name}
            count={
              data.dailyQuests.filter((q) => q.status === status.name).length
            }
          />
          <KanbanCards>
            {data.dailyQuests
              .filter((q) => q.status === status.name)
              .sort((a, b) => {
                if (a.dueDate === null && b.dueDate === null) return 0;

                if (a.dueDate === null) return 1;
                if (b.dueDate === null) return -1;

                return (
                  new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
                );
              })
              .map((q: CompleteDailyQuest, index: number) => (
                <KanbanCard
                  key={q.id}
                  id={q.id}
                  name={q.title}
                  parent={status.name}
                  index={index}
                  data={q}
                  className="flex justify-between items-center"
                >
                  <div className="flex space-x-2 text-muted-foreground">
                    <Checkbox
                      id="completed"
                      defaultChecked={status.name === "completed"}
                      disabled={status.name === "completed"}
                      onCheckedChange={(checked) => handleChange(q, checked)}
                    />
                    <div className="flex flex-col space-y-2">
                      <div className="flex flex-col space-y-0.5">
                        <label
                          htmlFor="complete"
                          className="text-sm text-foreground"
                        >
                          {q.title}
                        </label>
                        {q.description && <p>{q.description}</p>}
                      </div>
                      {q.dueDate && (
                        <div
                          className={`flex space-x-0.5 items-center ${getDueDateColor(q.dueDate)}`}
                        >
                          <Calendar size={10} />
                          <p className="capitalize">
                            {formatDueDate(q.dueDate)}
                          </p>
                          {q.recurrence && q.recurrence !== "none" && (
                            <RefreshCw size={10} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </KanbanCard>
              ))}
          </KanbanCards>
          {status.name === "open" && <DailyQuestModal emptyState />}
        </KanbanBoard>
      ))}
    </KanbanProvider>
  );
};

export default DailyQuestKanban;
