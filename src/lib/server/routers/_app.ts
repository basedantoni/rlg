import { router } from "@/lib/server/trpc"
import { questsRouter } from "@/lib/server/routers/quests";

export const appRouter = router({
        quests: questsRouter,
});

export type AppRouter = typeof appRouter;
