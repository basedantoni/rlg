import {
  accountabilityPartnershipIdSchema,
  insertAccountabilityPartnershipParams,
  updateAccountabilityPartnershipParams,
} from '@repo/db';
import { router, protectedProcedure } from '../trpc';
import {
  createAccountabilityPartnership,
  updateAccountabilityPartnership,
  deleteAccountabilityPartnership,
} from '#lib/api/accountabilityPartnerships/mutations';
import {
  getAccountabilityPartnershipById,
  getAccountabilityPartnerships,
} from '#lib/api/accountabilityPartnerships/queries';

export const accountabilityPartnershipsRouter = router({
  create: protectedProcedure
    .input(insertAccountabilityPartnershipParams)
    .mutation(async ({ input }) => {
      return createAccountabilityPartnership(input);
    }),
  update: protectedProcedure
    .input(updateAccountabilityPartnershipParams)
    .mutation(async ({ input }) => {
      return updateAccountabilityPartnership(input.id!, input);
    }),
  delete: protectedProcedure
    .input(accountabilityPartnershipIdSchema)
    .mutation(async ({ input }) => {
      return deleteAccountabilityPartnership(input.id!);
    }),
  getById: protectedProcedure
    .input(accountabilityPartnershipIdSchema)
    .query(async ({ input }) => {
      return getAccountabilityPartnershipById(input.id!);
    }),
  getAll: protectedProcedure.query(async () => {
    return getAccountabilityPartnerships();
  }),
});
