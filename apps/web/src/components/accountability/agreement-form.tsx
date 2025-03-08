'use client';

import {
  AccountabilityAgreements,
  NewAccountabilityAgreementParams,
} from '@/db/schema/accountabilityAgreements';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { insertAccountabilityAgreementParams } from '@/db/schema/accountabilityAgreements';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc/client';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/custom/number-input';
import { FormTimePicker } from '@/components/ui/custom/form-time-picker';
import { Button } from '@/components/ui/button';

interface AgreementFormProps {
  partnershipId: string;
  agreement?: AccountabilityAgreements;
}

const AgreementForm = ({ partnershipId, agreement }: AgreementFormProps) => {
  const editing = !!agreement?.id;
  const router = useRouter();

  const form = useForm<z.infer<typeof insertAccountabilityAgreementParams>>({
    resolver: zodResolver(insertAccountabilityAgreementParams),
    defaultValues: agreement ?? {
      partnershipId,
      penaltyAmount: 1,
      penaltyUnit: '',
      cutoffTime: new Date().toISOString(),
      status: 'inactive',
    },
  });

  const onSuccess = async (
    action: 'create' | 'update' | 'delete',
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    router.refresh();
    toast.success(`Agreement ${action}d!`);
  };

  const { mutate: createAgreement, isPending: isCreating } =
    trpc.accountabilityAgreements.create.useMutation({
      onSuccess: () => onSuccess('create'),
      onError: (err) => console.error('create', { error: err.message }),
    });

  const { mutate: updateAgreement, isPending: isUpdating } =
    trpc.accountabilityAgreements.update.useMutation({
      onSuccess: () => onSuccess('update'),
      onError: (err) => console.error('update', { error: err.message }),
    });

  const handleSubmit = (values: NewAccountabilityAgreementParams) => {
    if (editing) {
      updateAgreement({
        ...values,
        id: agreement.id,
      });
    } else {
      createAgreement(values);
    }
  };

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(handleSubmit)}>
        <FormField
          control={form.control}
          name='penaltyUnit'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penalty Unit</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormDescription>
                This is the penalty for missing your daily quests.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='penaltyAmount'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Penalty Amount</FormLabel>
              <NumberInput field={field} />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='cutoffTime'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cutoff Time</FormLabel>
              <FormControl>
                <FormTimePicker field={field} />
              </FormControl>
              <FormDescription>
                Tasks must be completed by this time to avoid penalties.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end'>
          <Button type='submit' disabled={isCreating || isUpdating}>
            {editing ? 'Update' : 'Create'} Agreement
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AgreementForm;
