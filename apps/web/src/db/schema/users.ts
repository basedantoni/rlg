import { getUser } from '@/lib/api/users/queries';
import { sql, relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { accountabilityPartnerships } from './accountabilityPartnerships';
import { dailyQuests } from './dailyQuests';
import { penalties } from './penalties';
import { quests } from './quests';
import { z } from 'zod';

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text('name'),
  xp: integer('xp'),
  level: integer('level'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const usersRelations = relations(users, ({ many }) => ({
  dailyQuests: many(dailyQuests),
  quests: many(quests),
  accountabilityPartnershipsAsUser1: many(accountabilityPartnerships, {
    relationName: 'accountabilityPartnershipsAsUser1',
  }),
  accountabilityPartnershipsAsUser2: many(accountabilityPartnerships, {
    relationName: 'accountabilityPartnershipsAsUser2',
  }),
  penalties: many(penalties),
}));

const baseSchema = createSelectSchema(users);

export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertUserParams = baseSchema;

export const updateUserSchema = createUpdateSchema(users).omit({
  id: true,
  createdAt: true,
});
export const updateUserParams = updateUserSchema.extend({}).omit({});

export const userIdSchema = baseSchema.pick({ id: true });

export type Users = typeof users.$inferSelect;
export type NewUser = z.infer<typeof insertUserSchema>;
export type NewUserParams = z.infer<typeof insertUserParams>;
export type UpdateUserParams = z.infer<typeof updateUserParams>;
export type UserId = z.infer<typeof userIdSchema>['id'];

// this type infers the return from getQuests() - meaining it will include joins
export type CompleteUser = Awaited<ReturnType<typeof getUser>>['user'];
