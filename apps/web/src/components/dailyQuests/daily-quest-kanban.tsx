'use client';

import {
  KanbanBoard,
  KanbanCard,
  KanbanCards,
  KanbanHeader,
  KanbanProvider,
} from '@/components/ui/kibo-ui/kanban';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

import DailyQuestForm from './daily-quest-form';
import {
  Calendar,
  Ellipsis,
  Pencil,
  Plus,
  RefreshCw,
  Trash,
} from 'lucide-react';

import type { DragEndEvent } from '@dnd-kit/core';
import { CompleteDailyQuest } from '@/db/schema/dailyQuests';
import { DailyQuestId } from '@/db/schema/dailyQuests';
import { Status } from '@/components/ui/kibo-ui/kanban';
import { UseMutateFunction } from '@tanstack/react-query';

import { getDueDateColor, formatDueDate, capitalize } from '@/lib/utils';
import { trpc } from '@/lib/trpc/client';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { getQueryKey } from '@trpc/react-query';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type CheckedState = boolean | 'indeterminate';

type OpenFormState = {
  type: 'edit' | 'add' | null;
  questId?: string;
};

interface DailyQuestKanbanCardProps {
  dailyQuest: CompleteDailyQuest;
  status: Status;
  idx: number;
  onCheckedChange: (q: CompleteDailyQuest, checked: CheckedState) => void;
  onDelete: UseMutateFunction<DailyQuestId>;
  isEditFormOpen: boolean;
  onEditFormToggle: (questId: string) => void;
}

const DailyQuestKanbanCard = ({
  dailyQuest,
  status,
  idx,
  onCheckedChange,
  onDelete,
  isEditFormOpen,
  onEditFormToggle,
}: DailyQuestKanbanCardProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const openAlertDialog = () => setIsAlertOpen(true);

  const handleAction = () => onDelete();

  return (
    <>
      {isEditFormOpen ? (
        <Card className='border border-border bg-background'>
          <CardContent className='p-0'>
            <DailyQuestForm
              dailyQuest={dailyQuest}
              closeForm={() => onEditFormToggle(dailyQuest.id)}
            />
          </CardContent>
        </Card>
      ) : (
        <KanbanCard
          key={dailyQuest.id}
          id={dailyQuest.id}
          name={dailyQuest.title}
          parent={status.name}
          index={idx}
          data={dailyQuest}
          className='flex justify-between items-center'
          draggable={status.name !== 'completed'}
        >
          <div className='flex space-x-2 w-full text-muted-foreground'>
            <Checkbox
              id='completed'
              defaultChecked={status.name === 'completed'}
              disabled={status.name === 'completed'}
              onCheckedChange={(checked) =>
                onCheckedChange(dailyQuest, checked)
              }
            />
            <div className='flex flex-col space-y-2 w-full'>
              <div className='flex flex-col space-y-0.5'>
                <div className='flex justify-between items-start'>
                  <label htmlFor='complete' className='text-sm text-foreground'>
                    {dailyQuest.title}
                  </label>
                  <DropdownMenu>
                    <DropdownMenuTrigger disabled={status.name === 'completed'}>
                      <Ellipsis className='cursor-pointer' size={16} />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onSelect={() => onEditFormToggle(dailyQuest.id)}
                      >
                        <Pencil size={16} />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={openAlertDialog}
                        className='text-destructive hover:text-destructive-foreground'
                      >
                        <Trash size={16} />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                {dailyQuest.description && <p>{dailyQuest.description}</p>}
              </div>
              {dailyQuest.dueDate && (
                <div
                  className={`flex space-x-0.5 items-center ${getDueDateColor(
                    dailyQuest.dueDate
                  )}`}
                >
                  <Calendar size={10} />
                  <p className='capitalize'>
                    {formatDueDate(dailyQuest.dueDate)}
                  </p>
                  {dailyQuest.recurrence &&
                    dailyQuest.recurrence !== 'none' && <RefreshCw size={10} />}
                </div>
              )}
            </div>
          </div>
        </KanbanCard>
      )}

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Daily Quest</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              daily quest.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={handleAction}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const DailyQuestKanban = ({
  dailyQuests,
}: {
  dailyQuests: CompleteDailyQuest[];
}) => {
  const queryClient = useQueryClient();
  const [openForm, setOpenForm] = useState<OpenFormState>({ type: null });

  const statuses: Status[] = [
    { id: '1', name: 'open' },
    { id: '3', name: 'completed' },
  ];

  const utils = trpc.useUtils();

  const onSuccess = async (
    action: 'update' | 'complete' | 'delete',
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast(data.error);
      return;
    }

    toast.success(`Daily Quest ${capitalize(action)}d`);
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
                : q
            );
          }
        );

        return { previousQuests };
      },
      onError: (err, updatedQuest, context) => {
        if (context?.previousQuests) {
          const queryKey = getQueryKey(trpc.quests.getQuests);
          queryClient.setQueryData(queryKey, context.previousQuests);
        }
        toast.error('Something went wrong with this quest');
      },
      onSuccess: () => onSuccess('update'),
      onSettled: () => utils.dailyQuests.getDailyQuests.invalidate(),
    });

  const { mutate: completeQuest } =
    trpc.dailyQuests.completeDailyQuest.useMutation({
      onSuccess: () => onSuccess('complete'),
      onSettled: () => utils.dailyQuests.getDailyQuests.invalidate(),
      onError: (err) => console.error('complete', { error: err.message }),
    });

  const { mutate: deleteQuest } = trpc.dailyQuests.deleteDailyQuest.useMutation(
    {
      onSuccess: () => onSuccess('delete'),
      onSettled: () => utils.dailyQuests.getDailyQuests.invalidate(),
      onError: (err) => console.error('delete', { error: err.message }),
    }
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const status = statuses.find((status) => status.name === over.id);

    if (!status) {
      return;
    }

    dailyQuests.map((q) => {
      if (q.id === active.id && q.status !== status.name) {
        over.id === 'completed'
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

  const handleDelete = (id: DailyQuestId) => deleteQuest({ id });

  const handleEditFormToggle = (questId: string) => {
    setOpenForm((prev) => {
      if (prev.type === 'edit' && prev.questId === questId) {
        return { type: null };
      }
      return { type: 'edit', questId };
    });
  };

  const handleAddFormToggle = () => {
    setOpenForm((prev) => {
      if (prev.type === 'add') {
        return { type: null };
      }
      return { type: 'add' };
    });
  };

  const closeAnyForm = () => {
    setOpenForm({ type: null });
  };

  return (
    <KanbanProvider onDragEnd={handleDragEnd}>
      {statuses.map((status) => (
        <KanbanBoard key={status.name} id={status.name}>
          <KanbanHeader
            className='capitalize'
            name={status.name}
            count={dailyQuests.filter((q) => q.status === status.name).length}
          />
          <KanbanCards>
            {dailyQuests
              .filter((q) => q.status === status.name)
              .map((q: CompleteDailyQuest, index: number) => (
                <DailyQuestKanbanCard
                  key={q.id}
                  dailyQuest={q}
                  idx={index}
                  status={status}
                  onCheckedChange={handleChange}
                  onDelete={() => handleDelete(q.id)}
                  isEditFormOpen={
                    openForm.type === 'edit' && openForm.questId === q.id
                  }
                  onEditFormToggle={handleEditFormToggle}
                />
              ))}
          </KanbanCards>

          {status.name === 'open' && (
            <div
              className={cn(
                dailyQuests.filter((q) => q.status === status.name).length >
                  0 && 'border-t'
              )}
            >
              {openForm.type === 'add' ? (
                <Card className='m-2 border border-border bg-background'>
                  <CardContent className='p-0'>
                    <DailyQuestForm closeForm={closeAnyForm} />
                  </CardContent>
                </Card>
              ) : (
                <Button
                  variant='ghost'
                  className='text-muted-foreground justify-start hover:bg-transparent'
                  onClick={handleAddFormToggle}
                >
                  <Plus size={16} />
                  Add Daily Quest
                </Button>
              )}
            </div>
          )}
        </KanbanBoard>
      ))}
    </KanbanProvider>
  );
};

export default DailyQuestKanban;
