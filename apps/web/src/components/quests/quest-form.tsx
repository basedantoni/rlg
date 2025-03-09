'use client';

import { Quests, insertQuestParams, NewQuestParams } from '@repo/db';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '../ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '#components/ui/form';
import { Input } from '../ui/input';

import { useRouter } from 'next/navigation';
import { trpc } from '#lib/trpc/client';
import { toast } from 'sonner';
import { Select, SelectContent, SelectTrigger, SelectItem } from '../ui/select';
import { SelectValue } from '@radix-ui/react-select';

const QuestForm = ({
  quest,
  closeModal,
}: {
  quest?: Quests;
  closeModal?: () => void;
}) => {
  const editing = !!quest?.id;
  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertQuestParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertQuestParams),
    defaultValues: quest ?? {
      title: '',
      description: '',
      dueDate: '',
      status: 'open',
      categoryId: null,
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

    await utils.quests.getQuests.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Quest ${action}d!`);
  };

  const { mutate: createQuest, isPending: isCreating } =
    trpc.quests.createQuest.useMutation({
      onSuccess: () => onSuccess('create'),
      onError: (err) => console.error('create', { error: err.message }),
    });

  const { mutate: updateQuest, isPending: isUpdating } =
    trpc.quests.updateQuest.useMutation({
      onSuccess: () => onSuccess('update'),
      onError: (err) => console.error('update', { error: err.message }),
    });

  // TODO: Add delete button
  // const { mutate: deleteQuest, isPending: isDeleting } =
  //   trpc.quests.deleteQuest.useMutation({
  //     onSuccess: () => onSuccess('delete'),
  //     onError: (err) => console.error('delete', { error: err.message }),
  //   });

  const handleSubmit = (values: NewQuestParams) => {
    if (editing) {
      updateQuest({ ...values, id: quest.id });
    } else {
      createQuest(values);
    }
  };

  const isDisabled = isCreating || isUpdating;

  const { data: categories } = trpc.categories.getAll.useQuery();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={'space-y-2 md:space-y-4'}
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='categoryId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value ?? undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select category' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories?.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
                <FormMessage />
              </Select>
            </FormItem>
          )}
        />
        <Button type='submit' className='mr-1' disabled={isDisabled}>
          {editing
            ? `Sav${isDisabled ? 'ing...' : 'e'}`
            : `Creat${isDisabled ? 'ing...' : 'e'}`}
        </Button>
      </form>
    </Form>
  );
};

export default QuestForm;
