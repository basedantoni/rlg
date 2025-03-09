import { getLevelDefinitionByLevel } from '#lib/api/levelDefinitions/queries';
import { router, protectedProcedure } from '../trpc';
import { levelDefinitionLevelSchema } from '@repo/db';

export const levelDefinitionsRouter = router({
  getLevelDefinitionByLevel: protectedProcedure
    .input(levelDefinitionLevelSchema)
    .query(async ({ input }) => {
      return getLevelDefinitionByLevel(input.level);
    }),
});
