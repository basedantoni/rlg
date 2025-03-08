import { db } from '#db/drizzle';
import { eq } from 'drizzle-orm';
import { levelDefinitions } from '#db/schema';
import { getUserAuth } from '#lib/auth/utils';

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
