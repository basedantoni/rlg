import DailyQuestKanban from "@/components/dailyQuests/daily-quest-kanban";
import { LevelProgressCard } from "@/components/levels/level-progress-card";
import { CompleteDailyQuest } from "@/db/schema/dailyQuests";
import { CompleteUser } from "@/db/schema/users";
import { trpc } from "@/lib/trpc/api";

export default async function DashboardPage() {
  const dq: { dailyQuests: CompleteDailyQuest[] } =
    await trpc.dailyQuests.getDailyQuests();
  const u: { user: CompleteUser } = await trpc.users.getUser();

  const nextLevel = await trpc.levelDefinitions.getLevelDefinitionByLevel({
    level: u.user.level + 1,
  });

  return (
    <section className="flex flex-col flex-1 p-2 h-screen overflow-hidden slim-scroll">
      <h1>Daily Quests</h1>
      <DailyQuestKanban dailyQuests={dq.dailyQuests} />
      <LevelProgressCard
        nextLevelXP={nextLevel.levelDefinition?.xpTreshold!}
        currentXP={u.user.xp}
      />
    </section>
  );
}
