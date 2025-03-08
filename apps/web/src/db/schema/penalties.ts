import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { accountabilityAgreements } from './accountabilityAgreements';
import { users } from './users';
import { sql, relations } from 'drizzle-orm';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { z } from 'zod';
import { nanoid } from 'nanoid';

export const penalties = sqliteTable('penalties', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  agreementId: text('agreement_id').references(
    () => accountabilityAgreements.id,
    { onDelete: 'cascade' }
  ),
  userId: text('user_id').references(() => users.id, {
    onDelete: 'cascade',
  }),
  missedQuestsCount: integer('missed_quests_count'),
  status: text('status').$type<'active' | 'inactive'>().default('active'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const penaltiesRelations = relations(penalties, ({ one }) => ({
  agreement: one(accountabilityAgreements, {
    fields: [penalties.agreementId],
    references: [accountabilityAgreements.id],
  }),
  user: one(users, {
    fields: [penalties.userId],
    references: [users.id],
  }),
}));

const baseSchema = createSelectSchema(penalties);

export const insertPenaltySchema = createInsertSchema(penalties)
  .omit({ id: true, createdAt: true, updatedAt: true })
  .extend({ status: z.enum(['active', 'inactive']).nullable() });

export const updatePenaltySchema = createUpdateSchema(penalties)
  .omit({ createdAt: true })
  .extend({ status: z.enum(['active', 'inactive']).nullable() });

export const penaltyIdSchema = baseSchema.pick({ id: true });

export const insertPenaltyParams = insertPenaltySchema.extend({}).omit({});

export const updatePenaltyParams = updatePenaltySchema.extend({}).omit({});

export type Penalties = typeof penalties.$inferSelect;
export type NewPenalty = z.infer<typeof insertPenaltySchema>;
export type NewPenaltyParams = z.infer<typeof insertPenaltyParams>;
export type UpdatePenaltyParams = z.infer<typeof updatePenaltyParams>;
export type PenaltyId = z.infer<typeof penaltyIdSchema>['id'];
