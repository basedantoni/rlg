import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import {
  DailyQuestId,
  dailyQuestIdSchema,
  dailyQuests,
  insertDailyQuestSchema,
  NewDailyQuest,
  UpdateDailyQuestParams,
  updateDailyQuestSchema,
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

export const updateDailyQuest = async (
  id: DailyQuestId,
  dailyQuest: UpdateDailyQuestParams,
) => {
  const { session } = await getUserAuth();
  const { id: dailyQuestId } = dailyQuestIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }

  const newDailyQuest = updateDailyQuestSchema.parse({
    ...dailyQuest,
    userId: session.user.id,
  });
  try {
    const [dq] = await db
      .update(dailyQuests)
      .set({ ...newDailyQuest, updatedAt: new Date().toISOString() })
      .where(eq(dailyQuests.id, dailyQuestId!))
      .returning();
    return { dailyQuest: dq };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};

export const deleteDailyQuest = async (id: DailyQuestId) => {
  const { session } = await getUserAuth();
  const { id: dailyQuestId } = dailyQuestIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }

  try {
    const [dq] = await db
      .delete(dailyQuests)
      .where(eq(dailyQuests.id, dailyQuestId!))
      .returning();
    return { dailyQuest: dq };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
