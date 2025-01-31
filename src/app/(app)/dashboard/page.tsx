import QuestList from "@/components/quests/quest-list";
import { Quests } from "@/db/schema/quests";
import { trpc } from "@/lib/trpc/api";

export default async function DashboardPage() {
  const res: { quests: Quests[] } = await trpc.quests.getQuests();
  return (
    <>
      <h1>Dashboard</h1>
      <QuestList quests={res.quests} />
    </>
  );
}
