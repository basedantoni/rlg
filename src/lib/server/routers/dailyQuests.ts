import { insertDailyQuestParams } from "@/db/schema/dailyQuests";
import { publicProcedure, router } from "@/lib/server/trpc";
import { createDailyQuest } from "@/lib/api/dailyQuests/mutations";

export const dailyQuestsRouter = router({
  createDailyQuest: publicProcedure
    .input(insertDailyQuestParams)
    .mutation(async ({ input }) => {
      return createDailyQuest(input);
    }),
});
