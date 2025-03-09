'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Quests, CompleteDailyQuest } from '@repo/db';
import {
  Activity,
  Calendar,
  FileText,
  Shield,
  ArrowUp,
  CircleDot,
} from 'lucide-react';
import { format } from 'date-fns';
import { Badge } from '#components/ui/badge';
import { Button } from '#components/ui/button';
import { ActivityRing } from '#components/ui/activity-ring';

type QuestWithDailyQuests = Quests & {
  dailyQuests: CompleteDailyQuest[];
};

export const columns: ColumnDef<QuestWithDailyQuests>[] = [
  {
    header: () => (
      <div className='flex items-center space-x-2'>
        <Shield size={16} />
        <span className='pt-0.5'>Quest</span>
      </div>
    ),
    accessorKey: 'title',
  },
  {
    header: () => (
      <div className='flex items-center space-x-2'>
        <FileText size={16} />
        <span className='pt-0.5'>Description</span>
      </div>
    ),
    accessorKey: 'description',
  },
  {
    header: () => (
      <div className='flex items-center space-x-2'>
        <CircleDot size={16} />
        <span className='pt-0.5'>Progress</span>
      </div>
    ),
    id: 'progress',
    cell: ({ row }) => {
      const dailyQuests = row.original.dailyQuests || [];
      const total = dailyQuests.length;
      const completed = dailyQuests.filter(
        (dq) => dq.status === 'completed'
      ).length;

      return total > 0 ? (
        <ActivityRing completed={completed} total={total} size='sm' />
      ) : (
        <span className='text-gray-500 text-sm'>No daily quests</span>
      );
    },
  },
  {
    header: ({ column }) => (
      <Button
        variant='ghost'
        className='flex items-center space-x-2'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        <div className='flex items-center space-x-1'>
          <Activity size={16} />
          <span className='pt-0.5'>Status</span>
        </div>
        {column.getIsSorted() === 'asc' ? <ArrowUp size={16} /> : null}
      </Button>
    ),
    accessorKey: 'status',
    cell: ({ row }) => (
      <Badge
        className='capitalize'
        variant={
          row.getValue('status') === 'completed' ? 'success' : 'secondary'
        }
      >
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    header: () => (
      <div className='flex items-center gap-2'>
        <Calendar size={16} />
        <span className='pt-0.5'>Due Date</span>
      </div>
    ),
    accessorKey: 'dueDate',
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate');
      if (!dueDate) {
        return (
          <div className='flex items-center gap-2'>
            <span className='text-sm text-muted-foreground'>No Due Date</span>
          </div>
        );
      }
      const parsedDate = new Date(dueDate as string);
      const formattedDate = format(parsedDate, 'MMM d');

      return (
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>{formattedDate}</span>
        </div>
      );
    },
  },
];
