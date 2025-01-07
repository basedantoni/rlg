import { db } from "@/db/drizzle";
import {
  dailyQuests,
  insertDailyQuestSchema,
  NewDailyQuest,
} from "@/db/schema/dailyQuests";
import { getUserAuth } from "@/lib/auth/utils";

export const createDailyQuest = async (dailyQuest: NewDailyQuest) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }

  const newDailyQuest = insertDailyQuestSchema.parse({
    ...dailyQuest,
    userId: session.user.id,
  });

  try {
    const [d] = await db.insert(dailyQuests).values(newDailyQuest).returning();
    return { dailyQuests: d };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
