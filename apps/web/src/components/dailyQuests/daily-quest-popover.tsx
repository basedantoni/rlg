"use client";

import DailyQuestForm from '@/components/dailyQuests/daily-quest-form';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const DailyQuestPopover = () => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="text-muted-foreground justify-start hover:bg-transparent"
        >
          <Plus size={16} />
          Add Daily Quest
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <DailyQuestForm />
      </PopoverContent>
    </Popover>
  );
};

export default DailyQuestPopover;
