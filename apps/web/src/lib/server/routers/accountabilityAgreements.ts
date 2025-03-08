import { router, protectedProcedure } from '../trpc';
import {
  insertAccountabilityAgreementParams,
  updateAccountabilityAgreementParams,
  accountabilityAgreementIdSchema,
} from '@/db/schema/accountabilityAgreements';
import {
  createAccountabilityAgreement,
  updateAccountabilityAgreement,
  deleteAccountabilityAgreement,
} from '@/lib/api/accountabilityAgreements/mutations';
import { getRecentAccountabilityAgreements } from '@/lib/api/accountabilityAgreements/queries';

export const accountabilityAgreementsRouter = router({
  create: protectedProcedure
    .input(insertAccountabilityAgreementParams)
    .mutation(async ({ input }) => {
      return createAccountabilityAgreement(input);
    }),
  update: protectedProcedure
    .input(updateAccountabilityAgreementParams)
    .mutation(async ({ input }) => {
      return updateAccountabilityAgreement(input.id!, input);
    }),
  delete: protectedProcedure
    .input(accountabilityAgreementIdSchema)
    .mutation(async ({ input }) => {
      return deleteAccountabilityAgreement(input.id!);
    }),
  getRecent: protectedProcedure.query(async () => {
    return getRecentAccountabilityAgreements();
  }),
});
