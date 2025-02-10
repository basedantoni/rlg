import {
  dailyQuestIdSchema,
  insertDailyQuestParams,
  updateDailyQuestParams,
} from "@/db/schema/dailyQuests";
import { protectedProcedure, router } from "@/lib/server/trpc";
import {
  createDailyQuest,
  deleteDailyQuest,
  updateDailyQuest,
} from "@/lib/api/dailyQuests/mutations";
import { questIdSchema, updateQuestParams } from "@/db/schema/quests";
import {
  getDailyQuestById,
  getDailyQuests,
} from "@/lib/api/dailyQuests/queries";

export const dailyQuestsRouter = router({
  createDailyQuest: protectedProcedure
    .input(insertDailyQuestParams)
    .mutation(async ({ input }) => {
      return createDailyQuest(input);
    }),
  getDailyQuests: protectedProcedure.query(async () => {
    return getDailyQuests();
  }),
  getDailyQuestById: protectedProcedure
    .input(dailyQuestIdSchema)
    .query(async ({ input }) => {
      return getDailyQuestById(input.id);
    }),
  updateDailyQuest: protectedProcedure
    .input(updateDailyQuestParams)
    .mutation(async ({ input }) => {
      return updateDailyQuest(input.id, input);
    }),
  deleteDailyQuest: protectedProcedure
    .input(questIdSchema)
    .mutation(async ({ input }) => {
      return deleteDailyQuest(input.id);
    }),
});
