import { categories } from './categories';
import { users } from './users';
import { relations, sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { dailyQuests } from './dailyQuests';

export const quests = sqliteTable('quests', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id),
  categoryId: text('category_id').references(() => categories.id, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').$type<'open' | 'completed'>().default('open'),
  dueDate: text('due_date'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const questsRelations = relations(quests, ({ many, one }) => ({
  dailyQuests: many(dailyQuests),
  user: one(users, {
    fields: [quests.userId],
    references: [users.id],
  }),
}));

const baseSchema = createSelectSchema(quests);

export const insertQuestSchema = createInsertSchema(quests)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    title: z.string().min(3),
    status: z.enum(['open', 'completed']).nullable(),
    categoryId: z.string().nullable(),
  });
export const insertQuestParams = insertQuestSchema.omit({
  id: true,
  userId: true,
});

export const updateQuestSchema = createUpdateSchema(quests)
  .omit({
    createdAt: true,
  })
  .extend({
    status: z.enum(['open', 'completed']).nullable(),
  });
export const updateQuestParams = updateQuestSchema.extend({}).omit({});

export const questIdSchema = baseSchema.pick({ id: true });

export type Quests = typeof quests.$inferSelect;
export type NewQuest = z.infer<typeof insertQuestSchema>;
export type NewQuestParams = z.infer<typeof insertQuestParams>;
export type UpdateQuestParams = z.infer<typeof updateQuestParams>;
export type QuestId = z.infer<typeof questIdSchema>['id'];

// TODO: Move this type into web app
type getQuests = Promise<{
  quests: {
    title: string;
    id: string;
    createdAt: string | null;
    updatedAt: string | null;
    description: string | null;
    userId: string | null;
    categoryId: string | null;
    status: 'open' | 'completed' | null;
    dueDate: string | null;
  }[];
}>;
// this type infers the return from getQuests() - meaining it will include joins
export type CompleteQuest = Awaited<getQuests>['quests'][number];
