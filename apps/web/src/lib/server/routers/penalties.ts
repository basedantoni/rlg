import { router, protectedProcedure } from '../trpc';
import {
  insertPenaltyParams,
  penaltyIdSchema,
  updatePenaltyParams,
} from '@/db/schema/penalties';
import {
  createPenalty,
  updatePenalty,
  deletePenalty,
} from '@/lib/api/penalties/mutations';
import { accountabilityAgreementIdSchema } from '@/db/schema/accountabilityAgreements';
import { getPenaltyToday, getPenaltyCount } from '@/lib/api/penalties/queries';

export const penaltiesRouter = router({
  create: protectedProcedure
    .input(insertPenaltyParams)
    .mutation(async ({ input }) => {
      return createPenalty(input);
    }),
  update: protectedProcedure
    .input(updatePenaltyParams)
    .mutation(async ({ input }) => {
      return updatePenalty(input);
    }),
  delete: protectedProcedure
    .input(penaltyIdSchema)
    .mutation(async ({ input }) => {
      return deletePenalty(input.id);
    }),
  getPenaltyToday: protectedProcedure
    .input(accountabilityAgreementIdSchema)
    .query(async ({ input }) => {
      return getPenaltyToday({ agreementId: input.id });
    }),
  getPenaltyCount: protectedProcedure
    .input(accountabilityAgreementIdSchema)
    .query(async ({ input }) => {
      return getPenaltyCount({ agreementId: input.id });
    }),
});
