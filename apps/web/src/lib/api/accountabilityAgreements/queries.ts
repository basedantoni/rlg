import { db } from '@/db/drizzle';
import { accountabilityPartnerships } from '@/db/schema/accountabilityPartnerships';
import { dailyQuests } from '@/db/schema/dailyQuests';
import { getUserAuth } from '@/lib/auth/utils';
import { and, eq, gt, lt, or } from 'drizzle-orm';

export const getRecentAccountabilityAgreements = async () => {
  const { session } = await getUserAuth();
  if (!session?.user.id) {
    throw new Error('User is not authenticated');
  }

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  // Convert to UTC ISO strings
  const twentyFourHoursAgoUTC = twentyFourHoursAgo.toISOString();

  // First get all partnerships where the user is either user1 or user2
  const partnerships = await db.query.accountabilityPartnerships.findMany({
    where: or(
      eq(accountabilityPartnerships.user1Id, session.user.id),
      eq(accountabilityPartnerships.user2Id, session.user.id)
    ),
    with: {
      user1: true,
      user2: true,
      agreement: true,
    },
  });

  // Filter partnerships with active agreements within the last 24 hours
  const filteredPartnerships = partnerships.filter(
    (p) =>
      p.agreement?.status === 'active' &&
      p.agreement?.cutoffTime &&
      new Date(p.agreement.cutoffTime).toISOString() > twentyFourHoursAgoUTC
  );

  // For each partnership, get the daily quests stats for both users
  const results = await Promise.all(
    filteredPartnerships.map(async (partnership) => {
      const user1DailyQuests = await getDailyQuestStats(partnership.user1Id);
      const user2DailyQuests = await getDailyQuestStats(partnership.user2Id);

      return {
        partnership,
        user1Stats: user1DailyQuests,
        user2Stats: user2DailyQuests,
      };
    })
  );

  return results;
};

export const getAllActiveAgreementsWithMissedQuests = async () => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  // Convert to UTC ISO strings
  const twentyFourHoursAgoUTC = twentyFourHoursAgo.toISOString();

  // Get all active partnerships with their agreements and users
  const partnerships = await db.query.accountabilityPartnerships.findMany({
    where: eq(accountabilityPartnerships.status, 'active'),
    with: {
      user1: true,
      user2: true,
      agreement: true,
    },
  });

  // Filter partnerships with active agreements and appropriate cutoff time
  const filteredPartnerships = partnerships.filter(
    (p) =>
      p.agreement?.status === 'active' &&
      p.agreement?.cutoffTime &&
      new Date(p.agreement.cutoffTime).toISOString() > twentyFourHoursAgoUTC
  );

  // For each partnership, check missed quests for both users
  const results = await Promise.all(
    filteredPartnerships.map(async (partnership) => {
      const user1MissedQuests = await getDailyQuestStats(partnership.user1Id);
      const user2MissedQuests = await getDailyQuestStats(partnership.user2Id);

      return {
        agreement: partnership.agreement,
        user1: {
          id: partnership.user1Id,
          missedQuestsCount: user1MissedQuests?.pastDueQuestsCount || 0,
          completedQuestsCount: user1MissedQuests?.completedQuestsLast24h || 0,
        },
        user2: {
          id: partnership.user2Id,
          missedQuestsCount: user2MissedQuests?.pastDueQuestsCount || 0,
          completedQuestsCount: user2MissedQuests?.completedQuestsLast24h || 0,
        },
      };
    })
  );

  // Filter to only include results where at least one user has missed quests
  return results.filter(
    (result) =>
      result.user1.missedQuestsCount > 0 || result.user2.missedQuestsCount > 0
  );
};

const getDailyQuestStats = async (userId: string | null) => {
  if (!userId) return null;

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  // Convert to UTC ISO strings
  const nowUTC = now.toISOString();
  const twentyFourHoursAgoUTC = twentyFourHoursAgo.toISOString();

  const completedQuests = await db
    .select()
    .from(dailyQuests)
    .where(
      and(
        eq(dailyQuests.userId, userId),
        eq(dailyQuests.status, 'completed'),
        gt(dailyQuests.updatedAt, twentyFourHoursAgoUTC)
      )
    );

  const pastDueQuests = await db
    .select()
    .from(dailyQuests)
    .where(
      and(
        eq(dailyQuests.userId, userId),
        eq(dailyQuests.status, 'open'),
        lt(dailyQuests.dueDate, nowUTC)
      )
    );

  return {
    completedQuestsLast24h: completedQuests.length,
    pastDueQuestsCount: pastDueQuests.length,
  };
};
