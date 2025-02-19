import DailyQuestKanban from "@/components/dailyQuests/daily-quest-kanban";
import { CompleteDailyQuest } from "@/db/schema/dailyQuests";
import { trpc } from "@/lib/trpc/api";

export default async function DashboardPage() {
  const dq: { dailyQuests: CompleteDailyQuest[] } =
    await trpc.dailyQuests.getDailyQuests();

  return (
    <section className="flex flex-col flex-1 space-y-2 p-2 h-screen overflow-hidden slim-scroll">
      <h1>Daily Quests</h1>

      <DailyQuestKanban dailyQuests={dq.dailyQuests} />
    </section>
  );
}
