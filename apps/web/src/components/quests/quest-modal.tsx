'use client';

import QuestForm from '#components/quests/quest-form';
import { Quests } from '#db/schema/quests';
import { useState } from 'react';

import { Button } from '#components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '#components/ui/dialog';
import { Plus } from 'lucide-react';

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
          <Button variant='ghost' size='icon'>
            <Plus size={32} strokeWidth={1} />
            <p className='text-xs'>New</p>
          </Button>
        ) : (
          <Button
            variant={editing ? 'ghost' : 'outline'}
            size={editing ? 'sm' : 'icon'}
          >
            {editing ? 'Edit' : '+'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? 'Edit' : 'Create'} Quest</DialogTitle>
          <DialogDescription>
            {editing ? 'Edit the quest details' : 'Create a new quest'}
          </DialogDescription>
        </DialogHeader>
        <QuestForm closeModal={closeModal} quest={quest} />
      </DialogContent>
    </Dialog>
  );
};

export default QuestModal;
