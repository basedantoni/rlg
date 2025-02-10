import { db } from "@/db/drizzle";
import { DailyQuestId, dailyQuests } from "@/db/schema/dailyQuests";
import { getUserAuth } from "@/lib/auth/utils";

export const getDailyQuests = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }
  const rows = await db.select().from(dailyQuests).limit(20);
  const dq = rows;
  return { dailyQuests: dq };
};
export const getDailyQuestById = async (id: DailyQuestId) => {};
