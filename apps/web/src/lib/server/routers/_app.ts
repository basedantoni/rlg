import { router } from '#lib/server/trpc';
import { accountabilityAgreementsRouter } from './accountabilityAgreements';
import { accountabilityPartnershipsRouter } from './accountabilityPartnerships';
import { categoriesRouter } from './categories';
import { dailyQuestsRouter } from './dailyQuests';
import { levelDefinitionsRouter } from './levelDefinitions';
import { penaltiesRouter } from './penalties';
import { questsRouter } from '#lib/server/routers/quests';
import { usersRouter } from './users';

export const appRouter = router({
  accountabilityAgreements: accountabilityAgreementsRouter,
  accountabilityPartnerships: accountabilityPartnershipsRouter,
  categories: categoriesRouter,
  dailyQuests: dailyQuestsRouter,
  levelDefinitions: levelDefinitionsRouter,
  penalties: penaltiesRouter,
  quests: questsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
