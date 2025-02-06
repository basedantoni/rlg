import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { QuestId, quests } from "@/db/schema/quests";
import { getUserAuth } from "@/lib/auth/utils";

export const getQuests = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }

  const rows = await db
    .select()
    .from(quests)
    .limit(20)
    .where(eq(quests.userId, session.user.id));
  const q = rows;
  return { quests: q };
};

export const getQuestById = async (id: QuestId) => {};
export const getQuestsDue = async () => {};
