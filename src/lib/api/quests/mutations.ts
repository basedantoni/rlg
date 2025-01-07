import { db } from "@/db/drizzle";
import {
  NewQuestParams,
  UpdateQuestParams,
  QuestId,
  insertQuestSchema,
  quests,
} from "@/db/schema/quests";
import { getUserAuth } from "@/lib/auth/utils";

export const createQuest = async (quest: NewQuestParams) => {
  console.log("api/quests/mutations.ts", quest);
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error("User is not authenticated");
  }

  const newQuest = insertQuestSchema.parse({
    ...quest,
    userId: session.user.id,
  });

  try {
    const [q] = await db.insert(quests).values(newQuest).returning();
    return { quest: q };
  } catch (err) {
    const message = (err as Error).message ?? "Error, please try again";
    console.error(message);
    throw { error: message };
  }
};
export const updateQuest = async (id: QuestId, quest: UpdateQuestParams) => {};
export const deleteQuest = async (id: QuestId) => {};
