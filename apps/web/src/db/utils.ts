// TODO: Move to db package
import { getUserAuth } from '#lib/auth/utils';
import { asc, desc, SQL } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { SQLiteColumn } from 'drizzle-orm/sqlite-core';

/**
 * Creates a where clause to filter entities by the current user's ID
 * @param table The database table/entity with a userId column
 * @returns SQL expression for filtering by userId
 */
export const createUserFilter = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  table: { userId: SQLiteColumn<any> }
): Promise<SQL> => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  return eq(table.userId, session.user.id);
};

/**
 * Creates an orderBy clause that works across different entities
 * @param sortOptions Object containing sortBy and direction options
 * @param columnMapping Function that maps sort field names to actual column objects
 * @returns SQL expression for ordering results
 */
export const createOrderBy = <
  T extends { sortBy?: string; direction?: 'asc' | 'desc' },
>(
  sortOptions: T,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columnMapping: (field: string) => SQLiteColumn<any>
): SQL => {
  const sortField = sortOptions?.sortBy || 'createdAt';
  const sortDirection = sortOptions?.direction || 'asc';

  const column = columnMapping(sortField);
  return sortDirection === 'asc' ? asc(column) : desc(column);
};
