import { getQuestById, getQuests, getQuestsDue } from "@/lib/api/quests/queries";
import { publicProcedure, router } from "@/lib/server/trpc";
import {
        questIdSchema,
        insertQuestParams,
        updateQuestParams,
} from "@/db/schema/quests";
import { createQuest, deleteQuest, updateQuest } from "@/lib/api/quests/mutations";

export const questsRouter = router({
        getQuests: publicProcedure.query(async () => {
                return getQuests();
        }),
        getQuestsDue: publicProcedure.query(async () => {
                return getQuestsDue();
        }),
        getQuestById: publicProcedure.input(questIdSchema).query(async ({ input }) => {
                return getQuestById(input.id);
        }),
        createQuest: publicProcedure
                .input(insertQuestParams)
                .mutation(async ({ input }) => {
                        return createQuest(input);
                }),
        updateQuest: publicProcedure
                .input(updateQuestParams)
                .mutation(async ({ input }) => {
                        return updateQuest(input.id, input);
                }),
        deleteQuest: publicProcedure
                .input(questIdSchema)
                .mutation(async ({ input }) => {
                        return deleteQuest(input.id);
                }),
});
