import {
  NewAccountabilityPartnership,
  AccountabilityPartnershipId,
  UpdateAccountabilityPartnershipParams,
  accountabilityPartnerships,
  insertAccountabilityPartnershipSchema,
  updateAccountabilityPartnershipSchema,
  accountabilityPartnershipIdSchema,
} from '@repo/db';
import { db } from '#db/config';
import { getUserAuth } from '#lib/auth/utils';
import { eq } from 'drizzle-orm';

export const createAccountabilityPartnership = async (
  partnership: NewAccountabilityPartnership
) => {
  const { session } = await getUserAuth();
  console.log('session', session);
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const newPartnership = insertAccountabilityPartnershipSchema.parse({
    ...partnership,
    user1Id: session.user.id,
  });

  try {
    const [p] = await db
      .insert(accountabilityPartnerships)
      .values(newPartnership)
      .returning();
    return { accountabilityPartnerships: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateAccountabilityPartnership = async (
  id: AccountabilityPartnershipId,
  partnership: UpdateAccountabilityPartnershipParams
) => {
  const { session } = await getUserAuth();
  const { id: partnershipId } = accountabilityPartnershipIdSchema.parse({
    id,
  });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const updatedPartnership = updateAccountabilityPartnershipSchema.parse({
    ...partnership,
  });

  try {
    const [p] = await db
      .update(accountabilityPartnerships)
      .set({ ...updatedPartnership, updatedAt: new Date().toISOString() })
      .where(eq(accountabilityPartnerships.id, partnershipId!))
      .returning();
    return { accountabilityPartnerships: p };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteAccountabilityPartnership = async (
  id: AccountabilityPartnershipId
) => {
  const { session } = await getUserAuth();
  const { id: partnershipId } = accountabilityPartnershipIdSchema.parse({
    id,
  });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  try {
    await db
      .delete(accountabilityPartnerships)
      .where(eq(accountabilityPartnerships.id, partnershipId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
