'use client';

import {
  DailyQuests,
  insertDailyQuestParams,
  NewDailyQuestParams,
} from '@repo/db';
import { trpc } from '#lib/trpc/client';
import { capitalize } from '#lib/utils';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import DueDatePopover from '#components/ui/custom/due-date-popover';
import RecurrencePopover from '#components/ui/custom/recurrence-popover';
import { Button } from '#components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '#components/ui/form';
import { Input } from '#components/ui/input';
import { SearchableSelect } from '#components/ui/custom/searchable-select';
import { Separator } from '#components/ui/separator';
import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

const DailyQuestForm = ({
  dailyQuest,
  closeModal,
  closeForm,
}: {
  dailyQuest?: DailyQuests;
  closeModal?: () => void;
  closeForm?: () => void;
}) => {
  const editing = !!dailyQuest?.id;
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertDailyQuestParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertDailyQuestParams),
    defaultValues: dailyQuest
      ? {
          ...dailyQuest,
          dueDate: dailyQuest.dueDate,
        }
      : {
          title: '',
          description: '',
          dueDate: null, // or new Date() if you prefer a default date
          recurrence: 'none',
          questId: null,
          weeklyDays: null,
        },
  });

  const onSuccess = async (
    action: 'create' | 'update' | 'delete',
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast(data.error);
      return;
    }

    utils.dailyQuests.getDailyQuests.invalidate();
    if (closeModal) closeModal();
    toast.success(`Daily Quest ${capitalize(action)}d`);
  };

  const { mutate: createDailyQuest, isPending: isCreating } =
    trpc.dailyQuests.createDailyQuest.useMutation({
      onSuccess: () => onSuccess('create'),
      onError: (err: { message: string }) =>
        console.error('create', { error: err.message }),
    });

  const { mutate: updateQuest, isPending: isUpdating } =
    trpc.dailyQuests.updateDailyQuest.useMutation({
      onSuccess: () => onSuccess('update'),
      onError: (err: { message: string }) =>
        console.error('update', { error: err.message }),
    });

  const { mutate: createQuest, isPending: isCreatingQuest } =
    trpc.quests.createQuest.useMutation({
      onSuccess: () => {
        toast.success('Quest created');
        utils.quests.getQuests.invalidate();
      },
      onError: (err: { message: string }) =>
        console.error('create', { error: err.message }),
    });

  const { data: q } = trpc.quests.getQuests.useQuery();

  const handleSubmit = (values: NewDailyQuestParams) => {
    // console.log('Submitting values:', values);
    // console.log('typeof weeklyDays:', typeof values.weeklyDays);

    // Make sure weeklyDays is a string or null, with no additional conversion needed
    const formattedValues = {
      ...values,
      weeklyDays: values.weeklyDays || null,
    };

    if (editing) {
      updateQuest({ ...formattedValues, id: dailyQuest.id });
    } else {
      createDailyQuest(formattedValues);
    }
  };

  const isDisabled = isCreating || isUpdating || isCreatingQuest;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={'py-2'}>
        <div className='px-2'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder='Daily Quest Name'
                    variant='ghost'
                    className='py-0 font-semibold placeholder:font-semibold md:text-base'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ''}
                    placeholder='Description'
                    variant='ghost'
                    className='py-0'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex gap-2 py-2'>
            <FormField
              control={form.control}
              name='dueDate'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormControl>
                    <DueDatePopover field={field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Controller
              control={form.control}
              name='weeklyDays'
              render={({ field: weeklyDaysField }) => (
                <FormField
                  control={form.control}
                  name='recurrence'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RecurrencePopover
                          field={field}
                          weeklyDaysField={weeklyDaysField}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            />
          </div>
        </div>
        <Separator className='mb-2' />
        <div className='flex items-center justify-between px-2'>
          <FormField
            control={form.control}
            name='questId'
            render={({ field }) => (
              <FormItem>
                <SearchableSelect
                  items={q?.quests || []}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder='Choose Quest'
                  searchPlaceholder='Type quest name'
                  getItemId={(quest) => quest.id}
                  getItemLabel={(quest) => quest.title}
                  filterItems={(quests, searchTerm) =>
                    quests.filter((q) =>
                      q.title.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  }
                  onCreateItem={(searchTerm) =>
                    createQuest({
                      title: searchTerm,
                      categoryId: null,
                      status: 'open',
                    })
                  }
                  triggerClassName='m-0'
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex justify-end gap-2'>
            {closeForm && (
              <Button
                type='button'
                size='icon'
                variant='outline'
                onClick={closeForm}
              >
                <X size={24} />
              </Button>
            )}
            <Button type='submit' size='icon' disabled={isDisabled}>
              <Check size={24} />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default DailyQuestForm;
