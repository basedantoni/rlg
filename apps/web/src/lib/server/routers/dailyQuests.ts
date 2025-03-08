import {
  dailyQuestIdSchema,
  insertDailyQuestParams,
  updateDailyQuestParams,
  sortOptionsSchema,
} from "@/db/schema/dailyQuests";
import { protectedProcedure, router } from "@/lib/server/trpc";
import {
  createDailyQuest,
  deleteDailyQuest,
  updateDailyQuest,
  completeDailyQuest,
} from "@/lib/api/dailyQuests/mutations";
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
  getDailyQuests: protectedProcedure
    .input(sortOptionsSchema)
    .query(async ({ input }) => {
      return getDailyQuests(input);
    }),
  getDailyQuestById: protectedProcedure
    .input(dailyQuestIdSchema)
    .query(async ({ input }) => {
      return getDailyQuestById(input.id);
    }),
  updateDailyQuest: protectedProcedure
    .input(updateDailyQuestParams)
    .mutation(async ({ input }) => {
      return updateDailyQuest(input.id!, input);
    }),
  deleteDailyQuest: protectedProcedure
    .input(dailyQuestIdSchema)
    .mutation(async ({ input }) => {
      return deleteDailyQuest(input.id);
    }),
  completeDailyQuest: protectedProcedure
    .input(updateDailyQuestParams)
    .mutation(async ({ input }) => {
      return completeDailyQuest(input.id!);
    }),
});
