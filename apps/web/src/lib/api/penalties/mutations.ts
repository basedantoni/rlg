import {
  insertPenaltySchema,
  NewPenalty,
  penalties,
  PenaltyId,
  updatePenaltySchema,
  UpdatePenaltyParams,
} from '@repo/db';
import { getUserAuth } from '#lib/auth/utils';
import { eq } from 'drizzle-orm';
import { db } from '#db/config';

export const createPenalty = async (penalty: NewPenalty) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const newPenalty = insertPenaltySchema.parse({
    ...penalty,
    userId: session.user.id,
  });

  try {
    const [p] = await db.insert(penalties).values(newPenalty).returning();
    return { penalties: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updatePenalty = async (penalty: UpdatePenaltyParams) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const updatedPenalty = updatePenaltySchema.parse({
    ...penalty,
    userId: session.user.id,
  });

  try {
    const [p] = await db
      .update(penalties)
      .set(updatedPenalty)
      .where(eq(penalties.id, penalty.id!))
      .returning();
    return { penalties: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deletePenalty = async (penalty: PenaltyId) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  try {
    await db.delete(penalties).where(eq(penalties.id, penalty));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
