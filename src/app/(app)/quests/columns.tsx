"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Quests } from "@/db/schema/quests";
import { formatDueDate } from '@/lib/utils';
import { Calendar } from 'lucide-react';

export const columns: ColumnDef<Quests>[] = [
  {
    header: "Quest",
    accessorKey: "title",
  },
  {
    header: "Description",
    accessorKey: "description",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <Calendar size={16} />
        <span>Due Date</span>
      </div>
    ),
    accessorKey: "dueDate",
    cell: ({row}) => {
      const dueDate = formatDueDate(row.getValue("dueDate"));

      return <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {dueDate}
        </span>
      </div>
    }
  },
];
