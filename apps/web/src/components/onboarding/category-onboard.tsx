'use client';

import { Layers2 } from 'lucide-react';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { Card } from '#components/ui/card';
import { Button } from '#components/ui/button';
import { toast } from 'sonner';

import { trpc } from '#lib/trpc/client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface CategoriesOnboard {
  icon: IconName;
  title: string;
  selected: boolean;
}

const CategoryOnboard = () => {
  const router = useRouter();

  const [categories, setCategories] = useState<Array<CategoriesOnboard>>([
    { icon: 'biceps-flexed', title: 'Fitness', selected: false },
    { icon: 'graduation-cap', title: 'Education', selected: false },
    { icon: 'paintbrush-vertical', title: 'Creative', selected: false },
    { icon: 'heart-handshake', title: 'Relationship', selected: false },
    { icon: 'briefcase-business', title: 'Career', selected: false },
    { icon: 'feather', title: 'Writing', selected: false },
    { icon: 'hand-coins', title: 'Finance', selected: false },
    { icon: 'sun', title: 'Spirtuality', selected: false },
    { icon: 'sticker', title: 'Social', selected: false },
  ]);

  const toggleCategory = (index: number) => {
    const newCategories = [...categories];
    newCategories[index]!.selected = !newCategories[index]!.selected;
    setCategories(newCategories);
  };

  const utils = trpc.useUtils();
  const onSuccess = async (
    action: 'create' | 'update' | 'delete',
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast.error(data.error);
      console.log(data.error);
      return;
    }

    toast(
      `${
        action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()
      }d category`
    );
    await utils.categories.getAll.invalidate();
  };

  const { mutate: createCategory, isPending: isCreating } =
    trpc.categories.createCategory.useMutation({
      onSuccess: () => onSuccess('create'),
      onError: (err) => console.error('create', { error: err.message }),
    });

  const handleBatchSubmit = async () => {
    try {
      await Promise.all(
        categories
          .filter((c: CategoriesOnboard) => c.selected)
          .map(async (c) => {
            return createCategory({ name: c.title });
          })
      );
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating categories:', error);
    }
  };

  return (
    <Card className='overflow-hidden sm:max-w-[400px] px-4 sm:px-8 py-8 sm:py-10 flex flex-col items-center gap-8'>
      <div className='relative'>
        <div className='z-20 w-16 h-16 flex justify-center items-center rounded-full bg-foreground'>
          <Layers2 size={32} className='stroke-background' />
        </div>
        {/* Blurs */}
        <div className='z-10 rotate-45 blur-md w-40 h-40 dark:bg-radial dark:from-white/50 dark:to-zinc-500/0 absolute -top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
        <div className='z-10 w-40 h-40 blur-xl dark:bg-linear-to-b dark:from-black/60 dark:to-[#202020] to-80% absolute bottom-[-200px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full'></div>
        {/* Rings */}
        <div className='w-[108px] h-[108px] rounded-full border border-zinc-400 dark:border-[#353535] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
        <div className='w-[88px] h-[88px] rounded-full border border-zinc-400 dark:border-[#353535] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'></div>
      </div>
      <p className='w-48 font-semibold text-center leading-5 z-10'>
        Choose categories you want to focus on
      </p>
      <div className='grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4 z-10'>
        {categories.map((c, index) => (
          <Card
            variant='selectable'
            gradient={true}
            className={`sm:w-24 sm:h-24 px-3 py-2 sm:py-4 gap-1 flex flex-col items-center justify-center ${
              c.selected
                ? 'bg-linear-to-b from-linear-top to-linear-bottom text-foreground'
                : ''
            }`}
            key={c.title}
            onClick={() => toggleCategory(index)}
          >
            <DynamicIcon name={c.icon} size={32} strokeWidth={1} />
            <p className='text-xs'>{c.title}</p>
          </Card>
        ))}
      </div>
      <div className='flex flex-col gap-1 justify-center w-full'>
        <Button className='w-full' onClick={handleBatchSubmit}>
          Submit
        </Button>
        <Button
          asChild
          variant='link'
          className='text-muted-foreground'
          disabled={isCreating}
        >
          <Link href='/dashboard'>Skip and add later</Link>
        </Button>
      </div>
    </Card>
  );
};

export default CategoryOnboard;
