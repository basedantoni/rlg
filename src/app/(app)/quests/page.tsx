import { Kanban } from "@/components/kanban";
import { trpc } from "@/lib/trpc/api";

export default async function QuestsPage() {
  const quests = await trpc.quests.getQuests();

  return (
    <>
      <h1>Quests</h1>
      <Kanban />
    </>
  );
}
