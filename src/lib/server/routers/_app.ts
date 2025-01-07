import { router } from "@/lib/server/trpc";
import { questsRouter } from "@/lib/server/routers/quests";
import { dailyQuestsRouter } from "./dailyQuests";

export const appRouter = router({
  dailyQuests: dailyQuestsRouter,
  quests: questsRouter,
});

export type AppRouter = typeof appRouter;
