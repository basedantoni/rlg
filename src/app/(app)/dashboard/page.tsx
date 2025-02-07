import QuestKanban from "@/components/quests/quest-kanban";
import QuestList from "@/components/quests/quest-list";
import { Quests } from "@/db/schema/quests";
import { trpc } from "@/lib/trpc/api";

export default async function DashboardPage() {
  const q: { quests: Quests[] } = await trpc.quests.getQuests();
  return (
    <>
      <h1>Dashboard</h1>
      <QuestList quests={q.quests} />
      <QuestKanban quests={q.quests} />
    </>
  );
}
