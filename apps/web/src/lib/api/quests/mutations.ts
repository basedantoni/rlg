import { eq, and } from 'drizzle-orm';
import {
  NewQuestParams,
  UpdateQuestParams,
  QuestId,
  updateQuestSchema,
  questIdSchema,
  insertQuestSchema,
  quests,
  db,
} from '@repo/db';
import { getUserAuth } from '#lib/auth/utils';

export const createQuest = async (quest: NewQuestParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const newQuest = insertQuestSchema.parse({
    ...quest,
    userId: session.user.id,
  });

  try {
    const [q] = await db.insert(quests).values(newQuest).returning();
    return { quest: q };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateQuest = async (id: QuestId, quest: UpdateQuestParams) => {
  const { session } = await getUserAuth();
  const { id: questId } = questIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const newQuest = updateQuestSchema.parse({
    ...quest,
    userId: session.user.id,
  });
  try {
    const [q] = await db
      .update(quests)
      .set({ ...newQuest, updatedAt: new Date().toISOString() })
      .where(and(eq(quests.id, questId!), eq(quests.userId, session.user.id)))
      .returning();
    return { quest: q };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteQuest = async (id: QuestId) => {
  const { session } = await getUserAuth();
  const { id: questId } = questIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  try {
    const [q] = await db
      .delete(quests)
      .where(and(eq(quests.id, questId!), eq(quests.userId, session.user.id)))
      .returning();
    return { quest: q };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
