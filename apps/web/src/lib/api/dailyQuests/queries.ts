import { dailyQuests, DailyQuestSortOptions } from '@repo/db';
import { createUserFilter, createOrderBy } from '#db/utils';
import { db } from '#db/config';

export const getDailyQuests = async (queryParams: DailyQuestSortOptions) => {
  try {
    // Column mapping function specific to dailyQuests
    const mapDailyQuestColumn = (field: string) => {
      switch (field) {
        case 'title':
          return dailyQuests.title;
        case 'dueDate':
          return dailyQuests.dueDate;
        case 'createdAt':
          return dailyQuests.createdAt;
        default:
          return dailyQuests.dueDate;
      }
    };

    const orderByClause = createOrderBy(queryParams, mapDailyQuestColumn);
    const userFilter = await createUserFilter(dailyQuests);

    console.log('db from query', db);
    const rows = await db.query.dailyQuests.findMany({
      orderBy: orderByClause,
      where: userFilter,
    });

    const dq = rows;
    return { dailyQuests: dq };
  } catch (error) {
    console.error('Error fetching daily quests:', error);
    // Include additional context for debugging
    console.error('Query params:', JSON.stringify(queryParams, null, 2));

    // Re-throw the error to be handled by the caller
    throw error;
  }
};
