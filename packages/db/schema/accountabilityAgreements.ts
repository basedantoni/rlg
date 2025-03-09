import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { accountabilityPartnerships } from './accountabilityPartnerships';
import { relations, sql } from 'drizzle-orm';
import { Penalties, penalties } from './penalties';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';

export const accountabilityAgreements = sqliteTable(
  'accountability_agreements',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => nanoid()),
    partnershipId: text('partnership_id').references(
      () => accountabilityPartnerships.id
    ),
    penaltyAmount: integer('penalty_amount').notNull(),
    penaltyUnit: text('penalty_unit').notNull(),
    cutoffTime: text('cutoff_time').notNull(),
    status: text('status').$type<'active' | 'inactive'>().default('active'),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  }
);

export const accountabilityAgreementsRelations = relations(
  accountabilityAgreements,
  ({ many, one }) => ({
    penalties: many(penalties),
    partnership: one(accountabilityPartnerships, {
      fields: [accountabilityAgreements.partnershipId],
      references: [accountabilityPartnerships.id],
    }),
  })
);

const baseSchema = createSelectSchema(accountabilityAgreements);

export const insertAccountabilityAgreementSchema = createInsertSchema(
  accountabilityAgreements
)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({
    status: z.enum(['active', 'inactive']).nullable(),
    penaltyAmount: z.number().positive(),
    penaltyUnit: z.string().min(3),
  });

export const updateAccountabilityAgreementSchema = createUpdateSchema(
  accountabilityAgreements
)
  .omit({ createdAt: true })
  .extend({ status: z.enum(['active', 'inactive']).nullable() });

export const accountabilityAgreementIdSchema = baseSchema.pick({ id: true });

export const insertAccountabilityAgreementParams =
  insertAccountabilityAgreementSchema.extend({}).omit({});

export const updateAccountabilityAgreementParams =
  updateAccountabilityAgreementSchema.extend({}).omit({});

export type AccountabilityAgreements =
  typeof accountabilityAgreements.$inferSelect;
export type AccountabilityAgreementsWithPenalties = AccountabilityAgreements & {
  penalties: Penalties[];
};
export type NewAccountabilityAgreement = z.infer<
  typeof insertAccountabilityAgreementSchema
>;
export type NewAccountabilityAgreementParams = z.infer<
  typeof insertAccountabilityAgreementParams
>;
export type UpdateAccountabilityAgreementParams = z.infer<
  typeof updateAccountabilityAgreementParams
>;
export type AccountabilityAgreementId = z.infer<
  typeof accountabilityAgreementIdSchema
>['id'];
