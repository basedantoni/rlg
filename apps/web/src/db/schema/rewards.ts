import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const rewards = sqliteTable('rewards', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

const baseSchema = createSelectSchema(rewards);

export const insertRewardSchema = createInsertSchema(rewards).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertRewardParams = baseSchema.omit({ id: true });

export const updateRewardSchema = createUpdateSchema(rewards).omit({
  id: true,
  createdAt: true,
});
export const updateRewardParams = updateRewardSchema.extend({}).omit({});

export const rewardIdSchema = baseSchema.pick({ id: true });

export type rewards = typeof rewards.$inferSelect;
export type NewReward = z.infer<typeof insertRewardSchema>;
export type NewRewardParams = z.infer<typeof insertRewardParams>;
export type UpdateRewardParams = z.infer<typeof updateRewardParams>;
export type rewardId = z.infer<typeof rewardIdSchema>['id'];
