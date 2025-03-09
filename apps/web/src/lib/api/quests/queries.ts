import { quests } from '@repo/db';
import { db } from '#db/config';
import { createUserFilter } from '#db/utils';

export const getQuests = async () => {
  const userFilter = await createUserFilter(quests);
  const rows = await db.select().from(quests).limit(20).where(userFilter);
  const q = rows;
  return { quests: q };
};

export const getQuestsWithDailyQuests = async () => {
  const userFilter = await createUserFilter(quests);
  const q = await db.query.quests.findMany({
    with: {
      dailyQuests: true,
    },
    where: userFilter,
  });
  return q;
};

export const getQuestsDue = async () => {};
