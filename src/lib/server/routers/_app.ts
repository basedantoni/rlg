import { router } from "@/lib/server/trpc";
import { questsRouter } from "@/lib/server/routers/quests";
import { dailyQuestsRouter } from "./dailyQuests";
import { categoriesRouter } from "./categories";

export const appRouter = router({
  dailyQuests: dailyQuestsRouter,
  quests: questsRouter,
  categories: categoriesRouter,
});

export type AppRouter = typeof appRouter;
