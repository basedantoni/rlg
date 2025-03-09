import { categories } from '@repo/db';
import { createUserFilter } from '#db/utils';
import { db } from '#db/config';

export const getCategories = async () => {
  const userFilter = await createUserFilter(categories);
  const rows = await db.select().from(categories).limit(20).where(userFilter);
  return rows;
};
