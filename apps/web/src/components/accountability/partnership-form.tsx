'use client';

import { trpc } from '#/lib/trpc/client';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AccountabilityPartnershipWithAgreement,
  insertAccountabilityPartnershipParams,
  NewAccountabilityPartnershipParams,
} from '#/db/schema/accountabilityPartnerships';
import { z } from 'zod';
import { toast } from 'sonner';

import { Button } from '#/components/ui/button';
import { Form } from '#/components/ui/form';

interface PartnershipFormProps {
  partnership?: AccountabilityPartnershipWithAgreement;
  userId?: string;
  closeModal?: () => void;
}

const PartnershipForm = ({
  partnership,
  userId,
  closeModal,
}: PartnershipFormProps) => {
  const editing = !!partnership?.id;
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertAccountabilityPartnershipParams>>({
    resolver: zodResolver(insertAccountabilityPartnershipParams),
    defaultValues: partnership ?? {
      status: 'active',
    },
  });

  const onSuccess = async (
    action: 'create' | 'accept' | 'delete',
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    await utils.accountabilityPartnerships.getAll.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Partnership ${action}d!`);
  };

  const { mutate: createPartnership, isPending: isCreating } =
    trpc.accountabilityPartnerships.create.useMutation({
      onSuccess: () => onSuccess('create'),
      onError: (err) => console.error('create', { error: err.message }),
    });

  const { mutate: updatePartnership, isPending: isUpdating } =
    trpc.accountabilityPartnerships.update.useMutation({
      onSuccess: () => onSuccess('accept'),
      onError: (err) => console.error('accept', { error: err.message }),
    });

  const { mutate: updateAgreement, isPending: isUpdatingAgreement } =
    trpc.accountabilityAgreements.update.useMutation({
      onSuccess: () => {},
      onError: (err) =>
        console.error('updateAgreement', { error: err.message }),
    });

  // TODO: Add delete button
  // const { mutate: deletePartnership, isPending: isDeleting } =
  //   trpc.accountabilityPartnerships.delete.useMutation({
  //     onSuccess: () => onSuccess('delete'),
  //     onError: (err) => console.error('delete', { error: err.message }),
  //   });

  const handleSubmit = (values: NewAccountabilityPartnershipParams) => {
    if (editing) {
      updatePartnership({
        ...values,
        user2Id: userId,
        id: partnership.id,
      });

      updateAgreement({
        status: 'active',
        id: partnership.agreement.id,
      });
    } else {
      createPartnership(values);
    }
  };

  const isDisabled = isCreating || isUpdating || isUpdatingAgreement;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Button type='submit' className='mr-1' disabled={isDisabled}>
          {editing
            ? `Join${isDisabled ? 'ing...' : ''}`
            : `Creat${isDisabled ? 'ing...' : 'e'}`}
        </Button>
      </form>
    </Form>
  );
};

export default PartnershipForm;
