"use client";

import QuestForm from "@/components/quests/quest-form";
import { Quests } from "@/db/schema/quests";
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

const QuestModal = ({
  quest,
  emptyState,
  onboarding,
}: {
  quest?: Quests;
  emptyState?: boolean;
  onboarding?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!quest?.id;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        {emptyState ? (
          <Button>
            <Plus size={16} />
            New Category
          </Button>
        ) : onboarding ? (
          <Button
            className="[&_svg]:size-8 w-24 h-24 gap-1 flex flex-col items-center justify-center"
            variant="ghost"
            size="icon"
          >
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
          <DialogTitle>{editing ? "Edit" : "Create"} Quest</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">
          <QuestForm closeModal={closeModal} quest={quest} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuestModal;
