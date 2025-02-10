import DailyQuestKanban from "@/components/dailyQuests/daily-quest-kanban";
import QuestList from "@/components/quests/quest-list";
import { DailyQuests } from "@/db/schema/dailyQuests";
import { Quests } from "@/db/schema/quests";
import { trpc } from "@/lib/trpc/api";

export default async function DashboardPage() {
  const q: { quests: Quests[] } = await trpc.quests.getQuests();
  const dq: { dailyQuests: DailyQuests[] } =
    await trpc.dailyQuests.getDailyQuests();

  return (
    <>
      <h1>Dashboard</h1>
      <QuestList quests={q.quests} />
      <DailyQuestKanban dailyQuests={dq.dailyQuests} />
    </>
  );
}
