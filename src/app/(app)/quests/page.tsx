import { Quests } from "@/db/schema/quests";
import { trpc } from "@/lib/trpc/api";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function QuestsPage() {
  const q: { quests: Quests[] } = await trpc.quests.getQuests();
  return (
    <section className="flex flex-col flex-1 p-2 space-y-4 h-screen overflow-hidden slim-scroll">
      <h1>Quests</h1>
      <DataTable columns={columns} data={q.quests} />
    </section>
  );
}
