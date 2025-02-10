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
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const DailyQuestModal = ({
  dailyQuest,
  emptyState,
  onboarding,
}: {
  dailyQuest?: DailyQuests;
  emptyState?: boolean;
  onboarding?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!dailyQuest?.id;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {emptyState ? (
          <Button>
            <Plus size={16} />
            New Category
          </Button>
        ) : onboarding ? (
          <Button variant="ghost" size="icon">
            <Plus size={32} strokeWidth={1} />
            <p className="text-xs">New</p>
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
        </DialogHeader>
        <div className="px-5 pb-5">
          <DailyQuestForm closeModal={closeModal} dailyQuest={dailyQuest} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyQuestModal;
