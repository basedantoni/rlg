import { db } from '#db/drizzle';
import { dailyQuests, DailyQuestSortOptions } from '#db/schema/dailyQuests';
import { createUserFilter, createOrderBy } from '#db/utils';

export const getDailyQuests = async (queryParams: DailyQuestSortOptions) => {
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

  const rows = await db.query.dailyQuests.findMany({
    orderBy: orderByClause,
    where: userFilter,
  });

  const dq = rows;
  return { dailyQuests: dq };
};
