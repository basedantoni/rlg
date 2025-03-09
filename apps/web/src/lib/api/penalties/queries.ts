import { getUserAuth } from '#lib/auth/utils';
import { eq, and, gte, lt } from 'drizzle-orm';
import { AccountabilityAgreementId, penalties } from '@repo/db';
import { db } from '#db/config';

export const getPenaltyToday = async ({
  agreementId,
  targetDate,
}: {
  agreementId: AccountabilityAgreementId;
  targetDate?: Date;
}) => {
  const { session } = await getUserAuth();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  // Use provided date or default to today
  const date = targetDate || new Date();

  // Create UTC dates for comparison
  const startOfDay = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      0,
      0,
      0,
      0
    )
  );

  const endOfDay = new Date(
    Date.UTC(
      date.getUTCFullYear(),
      date.getUTCMonth(),
      date.getUTCDate(),
      23,
      59,
      59,
      999
    )
  );

  console.log('Searching between:', {
    start: startOfDay.toISOString(),
    end: endOfDay.toISOString(),
    targetDate: date.toISOString(),
  });

  const penalty = await db.query.penalties.findFirst({
    where: and(
      and(
        gte(
          penalties.createdAt,
          startOfDay.toISOString().replace('T', ' ').replace('Z', '')
        ),
        lt(
          penalties.createdAt,
          endOfDay.toISOString().replace('T', ' ').replace('Z', '')
        )
      ),
      eq(penalties.agreementId, agreementId)
    ),
    with: {
      user: true,
    },
  });

  return { p: penalty };
};

export const getPenaltyCount = async ({
  agreementId,
}: {
  agreementId: AccountabilityAgreementId;
}) => {
  const { session } = await getUserAuth();
  if (!session) {
    throw new Error('User is not authenticated');
  }

  const penaltiesList = await db
    .select()
    .from(penalties)
    .where(eq(penalties.agreementId, agreementId));

  return penaltiesList.length;
};
