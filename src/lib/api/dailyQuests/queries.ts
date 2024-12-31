import { db } from "@/db/drizzle";
import { DailyQuestId, dailyQuests } from "@/db/schema/dailyQuests";

export const getDailyQuests = async () => {
        const rows = await db
                .select()
                .from(dailyQuests)
                .limit(20)
        const dq = rows;
        return { dailyQuests: dq }
}
export const getDailyQuestById = async (id: DailyQuestId) => { }
