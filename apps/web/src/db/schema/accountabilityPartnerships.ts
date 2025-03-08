import {
  accountabilityAgreements,
  AccountabilityAgreementsWithPenalties,
} from './accountabilityAgreements';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { relations, sql } from 'drizzle-orm';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { users, Users } from './users';
import { z } from 'zod';

export const accountabilityPartnerships = sqliteTable(
  'accountability_partnerships',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => nanoid()),
    user1Id: text('user1_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    user2Id: text('user2_id').references(() => users.id, {
      onDelete: 'set null',
    }),
    status: text('status').$type<'active' | 'inactive'>().default('active'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  }
);

export const accountabilityPartnershipsRelations = relations(
  accountabilityPartnerships,
  ({ one }) => ({
    user1: one(users, {
      fields: [accountabilityPartnerships.user1Id],
      references: [users.id],
      relationName: 'accountabilityPartnershipsAsUser1',
    }),
    user2: one(users, {
      fields: [accountabilityPartnerships.user2Id],
      references: [users.id],
      relationName: 'accountabilityPartnershipsAsUser2',
    }),
    agreement: one(accountabilityAgreements, {
      fields: [accountabilityPartnerships.id],
      references: [accountabilityAgreements.partnershipId],
    }),
  })
);

const baseSchema = createSelectSchema(accountabilityPartnerships);

export const selectAccountabilityPartnershipSchema = baseSchema.pick({
  id: true,
});

export const insertAccountabilityPartnershipSchema = createInsertSchema(
  accountabilityPartnerships
)
  .omit({ createdAt: true, updatedAt: true })
  .extend({ status: z.enum(['active', 'inactive']).nullable() });

export const updateAccountabilityPartnershipSchema = createUpdateSchema(
  accountabilityPartnerships
)
  .omit({ createdAt: true })
  .extend({ status: z.enum(['active', 'inactive']).nullable() });

export const accountabilityPartnershipIdSchema = baseSchema.pick({
  id: true,
});

export const insertAccountabilityPartnershipParams =
  insertAccountabilityPartnershipSchema.extend({}).omit({});

export const updateAccountabilityPartnershipParams =
  updateAccountabilityPartnershipSchema.extend({}).omit({});

export type AccountabilityPartnership =
  typeof accountabilityPartnerships.$inferSelect;
export type AccountabilityPartnershipWithUsers = AccountabilityPartnership & {
  user1: Users;
  user2: Users;
};
export type AccountabilityPartnershipWithAgreement =
  AccountabilityPartnership & {
    agreement: AccountabilityAgreementsWithPenalties;
  };

export type NewAccountabilityPartnership = z.infer<
  typeof insertAccountabilityPartnershipSchema
>;
export type NewAccountabilityPartnershipParams = z.infer<
  typeof insertAccountabilityPartnershipParams
>;
export type AccountabilityPartnershipQueryParams = z.infer<
  typeof selectAccountabilityPartnershipSchema
>;
export type UpdateAccountabilityPartnershipParams = z.infer<
  typeof updateAccountabilityPartnershipParams
>;
export type AccountabilityPartnershipId = z.infer<
  typeof accountabilityPartnershipIdSchema
>['id'];
