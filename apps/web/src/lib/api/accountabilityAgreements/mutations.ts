import { db } from '#/db/drizzle';
import {
  AccountabilityAgreementId,
  accountabilityAgreements,
  insertAccountabilityAgreementSchema,
  updateAccountabilityAgreementSchema,
} from '#/db/schema/accountabilityAgreements';
import {
  NewAccountabilityAgreement,
  UpdateAccountabilityAgreementParams,
  accountabilityAgreementIdSchema,
} from '#/db/schema/accountabilityAgreements';
import { getUserAuth } from '#/lib/auth/utils';
import { eq } from 'drizzle-orm';

export const createAccountabilityAgreement = async (
  agreement: NewAccountabilityAgreement
) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const newAgreement = insertAccountabilityAgreementSchema.parse({
    ...agreement,
    userId: session.user.id,
  });

  try {
    const [a] = await db
      .insert(accountabilityAgreements)
      .values(newAgreement)
      .returning();
    return { accountabilityAgreements: a };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const updateAccountabilityAgreement = async (
  id: AccountabilityAgreementId,
  agreement: UpdateAccountabilityAgreementParams
) => {
  const { session } = await getUserAuth();
  const { id: agreementId } = accountabilityAgreementIdSchema.parse({
    id,
  });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const updatedAgreement = updateAccountabilityAgreementSchema.parse({
    ...agreement,
    userId: session.user.id,
  });

  try {
    const [a] = await db
      .update(accountabilityAgreements)
      .set({ ...updatedAgreement, updatedAt: new Date().toISOString() })
      .where(eq(accountabilityAgreements.id, agreementId!))
      .returning();
    return { accountabilityAgreements: a };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};

export const deleteAccountabilityAgreement = async (
  id: AccountabilityAgreementId
) => {
  const { session } = await getUserAuth();
  const { id: agreementId } = accountabilityAgreementIdSchema.parse({
    id,
  });
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  try {
    await db
      .delete(accountabilityAgreements)
      .where(eq(accountabilityAgreements.id, agreementId!));
    return { success: true };
  } catch (err) {
    const message = (err as Error).message ?? 'Error, please try again';
    console.error(message);
    throw { error: message };
  }
};
