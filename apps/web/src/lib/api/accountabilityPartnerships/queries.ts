import {
  AccountabilityPartnershipId,
  accountabilityPartnerships,
} from '@repo/db';
import { getUserAuth } from '#lib/auth/utils';
import { eq, or } from 'drizzle-orm';
import { db } from '#db/config';

export const getAccountabilityPartnerships = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const rows = await db.query.accountabilityPartnerships.findMany({
    where: or(
      eq(accountabilityPartnerships.user1Id, session.user.id),
      eq(accountabilityPartnerships.user2Id, session.user.id)
    ),
    with: {
      user1: true,
      user2: true,
      agreement: {
        with: {
          penalties: true,
        },
      },
    },
  });
  return rows;
};

export const getAccountabilityPartnershipById = async (
  id: AccountabilityPartnershipId
) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const rows = await db.query.accountabilityPartnerships.findFirst({
    with: {
      user1: true,
      user2: true,
      agreement: {
        with: {
          penalties: true,
        },
      },
    },
    where: eq(accountabilityPartnerships.id, id),
  });
  return rows;
};
