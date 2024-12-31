import { db } from "@/db/drizzle"
import { QuestId, quests } from "@/db/schema/quests"

export const getQuests = async () => {
        const rows = await db
                .select()
                .from(quests)
                .limit(20);
        const q = rows;
        return { quests: q }
}
export const getQuestById = async (id: QuestId) => { }
export const getQuestsDue = async () => { }

