import DashboardContainer from '#/components/dashboard/dashboard-container';
import { CompleteDailyQuest } from '#/db/schema/dailyQuests';
import { trpc } from '#/lib/trpc/api';

export default async function DashboardPage() {
  const dq: { dailyQuests: CompleteDailyQuest[] } =
    await trpc.dailyQuests.getDailyQuests({
      sortBy: 'dueDate',
      direction: 'asc',
    });

  return <DashboardContainer initialDailyQuests={dq.dailyQuests} />;
}
