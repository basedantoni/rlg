import { getUserAuth } from '@/lib/auth/utils';
import { db } from '@/db/drizzle';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema/users';

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
