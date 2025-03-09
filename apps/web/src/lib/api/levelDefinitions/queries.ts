import { eq } from 'drizzle-orm';
import { levelDefinitions } from '@repo/db';
import { getUserAuth } from '#lib/auth/utils';
import { db } from '#db/config';

export const getLevelDefinitionByLevel = async (level: number) => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const ld = await db.query.levelDefinitions.findFirst({
    where: () => eq(levelDefinitions.level, level),
  });

  return { levelDefinition: ld };
};
