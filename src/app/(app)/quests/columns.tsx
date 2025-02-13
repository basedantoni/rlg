"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Quests } from "@/db/schema/quests";
import { Activity, Calendar, FileText, Shield, ArrowUp } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const columns: ColumnDef<Quests>[] = [
  {
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <Shield size={16} />
        <span className="pt-0.5">Quest</span>
      </div>
    ),
    accessorKey: "title",
  },
  {
    header: ({ column }) => (
      <div className="flex items-center space-x-2">
        <FileText size={16} />
        <span className="pt-0.5">Description</span>
      </div>
    ),
    accessorKey: "description",
  },
  {
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="flex items-center space-x-2"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        <div className="flex items-center space-x-1">
          <Activity size={16} />
          <span className="pt-0.5">Status</span>
        </div>
        {column.getIsSorted() === "asc" ? <ArrowUp size={16} /> : null}
      </Button>
    ),
    accessorKey: "status",
    cell: ({ row }) => (
      <Badge
        className="capitalize"
        variant={
          row.getValue("status") === "completed" ? "success" : "secondary"
        }
      >
        {row.getValue("status")}
      </Badge>
    ),
  },
  {
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        <Calendar size={16} />
        <span className="pt-0.5">Due Date</span>
      </div>
    ),
    accessorKey: "dueDate",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate");
      if (!dueDate) {
        return (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">No Due Date</span>
          </div>
        );
      }
      const parsedDate = new Date(dueDate as string);
      const formattedDate = format(parsedDate, "MMM d");

      return (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{formattedDate}</span>
        </div>
      );
    },
  },
];
