import { getUserAuth } from '#lib/auth/utils';
import { eq } from 'drizzle-orm';
import { users } from '@repo/db';
import { db } from '#db/config';

export const getUser = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const user = await db.query.users.findFirst({
    where: () => eq(users.id, session.user.id),
  });

  return { user };
};
