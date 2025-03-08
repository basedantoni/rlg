"use client";

import DailyQuestForm from "@/components/dailyQuests/daily-quest-form";
import { DailyQuests } from "@/db/schema/dailyQuests";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const DailyQuestModal = ({
  dailyQuest,
  emptyState,
}: {
  dailyQuest?: DailyQuests;
  emptyState?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!dailyQuest?.id;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger className="py-2" asChild>
        {emptyState ? (
          <Button
            variant="ghost"
            className="text-muted-foreground justify-start hover:bg-transparent"
          >
            <Plus size={16} />
            Add Daily Quest
          </Button>
        ) : (
          <Button
            variant={editing ? "ghost" : "outline"}
            size={editing ? "sm" : "icon"}
          >
            {editing ? "Edit" : "+"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{editing ? "Edit" : "Create"} Daily Quest</DialogTitle>
          <DialogDescription>
            {editing ? "Edit your daily quest" : "Create a new daily quest"}
          </DialogDescription>
        </DialogHeader>
        <div className="px-5 pb-5">
          <DailyQuestForm closeModal={closeModal} dailyQuest={dailyQuest} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyQuestModal;
