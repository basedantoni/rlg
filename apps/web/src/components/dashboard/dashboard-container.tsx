'use client';

import { Spinner } from '#components/ui/kibo-ui/spinner';
import DailyQuestKanban from '#components/dailyQuests/daily-quest-kanban';
import ViewOptionsPopover, {
  SortDirection,
} from '#components/ui/custom/view-options-popover';
import { CompleteDailyQuest } from '#db/schema/dailyQuests';
import { trpc } from '#lib/trpc/client';
import { useState } from 'react';

interface DashboardClientProps {
  initialDailyQuests: CompleteDailyQuest[];
}

const DashboardContainer = ({ initialDailyQuests }: DashboardClientProps) => {
  // Initial sort state
  const [sortBy, setSortBy] = useState<'title' | 'dueDate' | 'createdAt'>(
    'dueDate'
  );
  const [direction, setDirection] = useState<SortDirection>('asc');

  // Server query with sort parameters
  const { data, isLoading, isFetching } =
    trpc.dailyQuests.getDailyQuests.useQuery(
      { sortBy, direction },
      {
        initialData: { dailyQuests: initialDailyQuests },
      }
    );

  // Handle sort option changes
  const handleSortChange = (
    newSortBy: 'title' | 'dueDate' | 'createdAt',
    newDirection: SortDirection
  ) => {
    setSortBy(newSortBy);
    setDirection(newDirection);
  };

  return (
    <section className='flex flex-col flex-1 space-y-2 pl-4 h-full overflow-y-hidden slim-scroll'>
      <div className='py-1 flex justify-end'>
        <div className='flex'>
          <ViewOptionsPopover onSortChange={handleSortChange} />
        </div>
      </div>
      <h1>Daily Quests</h1>
      {isLoading || isFetching ? (
        <div className='flex items-center justify-center h-64'>
          <Spinner />
        </div>
      ) : (
        <DailyQuestKanban
          dailyQuests={data?.dailyQuests || initialDailyQuests}
        />
      )}
    </section>
  );
};

export default DashboardContainer;
