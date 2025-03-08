import { trpc } from '@/lib/trpc/api';
import { QuestActivityCard } from '@/components/quests/quest-activity-card';
import QuestModal from '@/components/quests/quest-modal';

export default async function QuestsPage() {
  const [quests] = await Promise.all([trpc.quests.getQuestsWithDailyQuests()]);

  return (
    <section className='flex flex-col flex-1 p-4 space-y-4 h-screen overflow-hidden slim-scroll'>
      <div className='flex space-x-2 items-center'>
        <h1>Quests</h1>
        <QuestModal />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {quests.map((quest) => (
          <QuestActivityCard
            key={quest.id}
            title={quest.title}
            dailyQuests={quest.dailyQuests}
          />
        ))}
      </div>
    </section>
  );
}
