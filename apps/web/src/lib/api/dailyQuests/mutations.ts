import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import {
  DailyQuestId,
  dailyQuestIdSchema,
  dailyQuests,
  insertDailyQuestSchema,
  NewDailyQuest,
  UpdateDailyQuestParams,
  updateDailyQuestSchema,
} from '@/db/schema/dailyQuests';
import { getUserAuth } from '@/lib/auth/utils';
import { calculateNextDueDate } from '@/lib/utils';
import { nanoid } from 'nanoid';
import { isBefore } from 'date-fns';

export const createDailyQuest = async (dailyQuest: NewDailyQuest) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const formattedDueDate = dailyQuest.dueDate
    ? new Date(dailyQuest.dueDate).toISOString()
    : null;

  // Format weeklyDays as a string if it's an array
  const formattedWeeklyDays = dailyQuest.weeklyDays
    ? Array.isArray(dailyQuest.weeklyDays)
      ? dailyQuest.weeklyDays.join(',')
      : dailyQuest.weeklyDays
    : null;

  // Use schema validation but with pre-formatted values
  const newDailyQuest = insertDailyQuestSchema.parse({
    ...dailyQuest,
    dueDate: formattedDueDate,
    userId: session.user.id,
    weeklyDays: formattedWeeklyDays,
  });

  try {
    const [d] = await db.insert(dailyQuests).values(newDailyQuest).returning();
    return { dailyQuests: d };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateDailyQuest = async (
  id: DailyQuestId,
  dailyQuest: UpdateDailyQuestParams
) => {
  const { session } = await getUserAuth();
  const { id: dailyQuestId } = dailyQuestIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  // Format weeklyDays as a string if it's an array
  const formattedWeeklyDays = dailyQuest.weeklyDays
    ? Array.isArray(dailyQuest.weeklyDays)
      ? dailyQuest.weeklyDays.join(',')
      : dailyQuest.weeklyDays
    : null;

  // Use schema validation but with pre-formatted values
  const updatedDailyQuest = updateDailyQuestSchema.parse({
    ...dailyQuest,
    userId: session.user.id,
    weeklyDays: formattedWeeklyDays,
  });

  try {
    const [dq] = await db
      .update(dailyQuests)
      .set({ ...updatedDailyQuest, updatedAt: new Date().toISOString() })
      .where(eq(dailyQuests.id, dailyQuestId!))
      .returning();
    return { dailyQuest: dq };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteDailyQuest = async (id: DailyQuestId) => {
  const { session } = await getUserAuth();
  const { id: dailyQuestId } = dailyQuestIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  try {
    const [dq] = await db
      .delete(dailyQuests)
      .where(eq(dailyQuests.id, dailyQuestId!))
      .returning();
    return { dailyQuest: dq };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const completeDailyQuest = async (id: DailyQuestId) => {
  const { session } = await getUserAuth();
  const { id: dailyQuestId } = dailyQuestIdSchema.parse({ id });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  try {
    const [dq] = await db
      .update(dailyQuests)
      .set({ status: 'completed', updatedAt: new Date().toISOString() })
      .where(eq(dailyQuests.id, dailyQuestId!))
      .returning();

    if (dq.recurrence && dq.dueDate) {
      // Parse weeklyDays from string if it exists
      let weeklyDaysArray = null;
      if (dq.weeklyDays) {
        weeklyDaysArray =
          typeof dq.weeklyDays === 'string'
            ? dq.weeklyDays.split(',').map(Number)
            : dq.weeklyDays;
      }

      const nextDueDate = calculateNextDueDate(
        isBefore(new Date(dq.dueDate), new Date())
          ? new Date().toISOString()
          : dq.dueDate,
        dq.recurrence,
        weeklyDaysArray
      );

      // Use the schema to parse the values, which will handle type conversions
      const newDailyQuest = insertDailyQuestSchema.parse({
        userId: dq.userId,
        questId: dq.questId,
        title: dq.title,
        description: dq.description,
        dueDate: nextDueDate,
        recurrence: dq.recurrence,
        weeklyDays: dq.weeklyDays, // Schema will handle conversion
      });

      await db.insert(dailyQuests).values({
        ...newDailyQuest,
        id: nanoid(),
        status: 'open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return { dailyQuest: dq };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
