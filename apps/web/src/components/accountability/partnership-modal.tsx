'use client';

import PartnershipForm from '@/components/accountability/partnership-form';
import { AccountabilityPartnershipWithAgreement } from '@/db/schema/accountabilityPartnerships';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const PartnershipModal = ({
  partnership,
  emptyState,
}: {
  partnership?: AccountabilityPartnershipWithAgreement;
  emptyState?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  const editing = !!partnership?.id;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger className='py-2' asChild>
        {emptyState ? (
          <Button
            variant='ghost'
            className='text-muted-foreground justify-start hover:bg-transparent'
          >
            <Plus size={16} />
            Add Partnership
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
        <DialogHeader className='px-5 pt-5'>
          <DialogTitle>{editing ? 'Edit' : 'Create'} Partnership</DialogTitle>
          <DialogDescription>
            {editing ? 'Edit your partnership' : 'Create a new partnership'}
          </DialogDescription>
        </DialogHeader>
        <div className='px-5 pb-5'>
          <PartnershipForm closeModal={closeModal} partnership={partnership} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PartnershipModal;
