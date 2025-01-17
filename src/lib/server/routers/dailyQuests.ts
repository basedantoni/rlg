import { insertDailyQuestParams } from "@/db/schema/dailyQuests";
import { protectedProcedure, router } from "@/lib/server/trpc";
import { createDailyQuest } from "@/lib/api/dailyQuests/mutations";

export const dailyQuestsRouter = router({
  createDailyQuest: protectedProcedure
    .input(insertDailyQuestParams)
    .mutation(async ({ input }) => {
      return createDailyQuest(input);
    }),
});
