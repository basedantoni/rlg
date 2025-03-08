import { getAllActiveAgreementsWithMissedQuests } from '@/lib/api/accountabilityAgreements/queries';
import { db } from '@/db/drizzle';
import { penalties } from '@/db/schema/penalties';
import { accountabilityAgreements } from '@/db/schema/accountabilityAgreements';
import { eq } from 'drizzle-orm';

export async function GET() {
  const agreements = await getAllActiveAgreementsWithMissedQuests();

  // Process each agreement and create penalties where needed
  for (const agreement of agreements) {
    const missedQuestsDiff =
      agreement.user1.missedQuestsCount - agreement.user2.missedQuestsCount;

    // Skip if both users have same number of missed quests
    if (missedQuestsDiff === 0) continue;

    // Determine which user missed more quests and calculate the difference
    const userWithMoreMissedQuests =
      missedQuestsDiff > 0 ? agreement.user1 : agreement.user2;
    const absoluteDifference = Math.abs(missedQuestsDiff);

    // Create a new penalty for the user who missed more quests
    try {
      await db.insert(penalties).values({
        agreementId: agreement.agreement.id,
        userId: userWithMoreMissedQuests.id,
        missedQuestsCount: absoluteDifference,
        status: 'active',
      });

      await db
        .update(accountabilityAgreements)
        .set({
          cutoffTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        })
        .where(eq(accountabilityAgreements.id, agreement.agreement.id));
    } catch (error) {
      console.error('Error creating penalty:', error);
    }
  }

  return new Response('Penalties processed successfully');
}
