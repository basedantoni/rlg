import QuestList from "@/components/quests/quest-list";
import { Quests } from "@/db/schema/quests";
import { trpc } from "@/lib/trpc/api";
import { DataTable } from "./data-table";
import { columns } from "./columns";
export default async function QuestsPage() {
  const q: { quests: Quests[] } = await trpc.quests.getQuests();
  return (
    <main className="flex flex-col flex-1 overflow-hidden h-screen slim-scroll">
      <QuestList quests={q.quests} />
      <DataTable columns={columns} data={q.quests} />
    </main>
  );
}
