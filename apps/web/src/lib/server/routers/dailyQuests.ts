import {
  dailyQuestIdSchema,
  insertDailyQuestParams,
  updateDailyQuestParams,
  sortOptionsSchema,
} from '@repo/db';
import { protectedProcedure, router } from '#lib/server/trpc';
import {
  createDailyQuest,
  deleteDailyQuest,
  updateDailyQuest,
  completeDailyQuest,
} from '#lib/api/dailyQuests/mutations';
import { getDailyQuests } from '#lib/api/dailyQuests/queries';

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
