import { router } from "@/lib/server/trpc";
import { categoriesRouter } from "./categories";
import { dailyQuestsRouter } from "./dailyQuests";
import { levelDefinitionsRouter } from "./levelDefinitions";
import { questsRouter } from "@/lib/server/routers/quests";
import { usersRouter } from "./users";

export const appRouter = router({
  categories: categoriesRouter,
  dailyQuests: dailyQuestsRouter,
  levelDefinitions: levelDefinitionsRouter,
  quests: questsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
