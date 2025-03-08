'use client';

import {
  Category,
  insertCategoryParams,
  NewCategoryParams,
} from '@/db/schema/categories';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trpc } from '@/lib/trpc/client';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const CategoryForm = ({
  category,
  closeModal,
}: {
  category?: Category;
  closeModal?: () => void;
}) => {
  const editing = !!category?.id;

  const router = useRouter();
  const utils = trpc.useUtils();

  const form = useForm<z.infer<typeof insertCategoryParams>>({
    resolver: zodResolver(insertCategoryParams),
    defaultValues: category ?? {
      name: '',
    },
  });

  const onSuccess = async (
    action: 'create' | 'edit' | 'delete',
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error);
      return;
    }

    await utils.categories.getAll.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast.success(`Category ${action}d`);
  };

  const { mutate: createCategory, isPending: isCreating } =
    trpc.categories.createCategory.useMutation({
      onSuccess: () => onSuccess('create'),
      onError: (err) => console.error('create', { error: err.message }),
    });

  const { mutate: updateCategory, isPending: isUpdating } =
    trpc.categories.updateCategory.useMutation({
      onSuccess: () => onSuccess('edit'),
      onError: (err) => console.error('edit', { error: err.message }),
    });

  const { mutate: deleteCategory, isPending: isDeleting } =
    trpc.categories.deleteCategory.useMutation({
      onSuccess: () => onSuccess('delete'),
      onError: (err) => console.error('delete', { error: err.message }),
    });

  const handleSubmit = (values: NewCategoryParams) => {
    if (editing) {
      updateCategory({ ...values, id: category.id });
    } else {
      createCategory(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={'space-y-8'}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }: { field: ControllerRenderProps }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type='submit'
          className='mr-1'
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? 'ing...' : 'e'}`
            : `Creat${isCreating ? 'ing...' : 'e'}`}
        </Button>
        {editing ? (
          <Button
            type='button'
            variant={'destructive'}
            onClick={() => deleteCategory({ id: category.id })}
          >
            Delet{isDeleting ? 'ing...' : 'e'}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default CategoryForm;
