import {
  getQuests,
  getQuestsDue,
  getQuestsWithDailyQuests,
} from '#lib/api/quests/queries';
import { protectedProcedure, router } from '#lib/server/trpc';
import { questIdSchema, insertQuestParams, updateQuestParams } from '@repo/db';
import {
  createQuest,
  deleteQuest,
  updateQuest,
} from '#lib/api/quests/mutations';

export const questsRouter = router({
  getQuests: protectedProcedure.query(async () => {
    return getQuests();
  }),
  getQuestsWithDailyQuests: protectedProcedure.query(async () => {
    return getQuestsWithDailyQuests();
  }),
  getQuestsDue: protectedProcedure.query(async () => {
    return getQuestsDue();
  }),
  createQuest: protectedProcedure
    .input(insertQuestParams)
    .mutation(async ({ input }) => {
      return createQuest(input);
    }),
  updateQuest: protectedProcedure
    .input(updateQuestParams)
    .mutation(async ({ input }) => {
      return updateQuest(input.id!, input);
    }),
  deleteQuest: protectedProcedure
    .input(questIdSchema)
    .mutation(async ({ input }) => {
      return deleteQuest(input.id);
    }),
});
