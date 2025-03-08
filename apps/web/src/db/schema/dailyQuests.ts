import { getDailyQuests } from '@/lib/api/dailyQuests/queries';
import { quests } from './quests';
import { users } from './users';
import { sql, relations } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const dailyQuests = sqliteTable('daily_quests', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id),
  questId: text('quest_id').references(() => quests.id, {
    onDelete: 'set null',
  }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').$type<'open' | 'completed'>().default('open'),
  dueDate: text('due_date'),
  recurrence: text('recurrence')
    .$type<
      | 'none'
      | 'daily'
      | 'workdays'
      | 'weekends'
      | 'weekly'
      | 'weekly_specific'
      | 'monthly'
    >()
    .default('none'),
  weeklyDays: text('weekly_days'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

export const dailyQuestsRelations = relations(dailyQuests, ({ one }) => ({
  quest: one(quests, {
    fields: [dailyQuests.questId],
    references: [quests.id],
  }),
  user: one(users, {
    fields: [dailyQuests.userId],
    references: [users.id],
  }),
}));

const baseSchema = createSelectSchema(dailyQuests);

export const selectDailyQuestSchema = baseSchema.pick({
  title: true,
  dueDate: true,
  createdAt: true,
});

export const insertDailyQuestSchema = createInsertSchema(dailyQuests)
  .omit({
    createdAt: true,
    updatedAt: true,
    status: true,
    id: true,
  })
  .extend({
    title: z.string().min(3),
    dueDate: z
      .string()
      .nullable()
      .refine((val) => val === null || !isNaN(Date.parse(val)), {
        message: 'Invalid Date',
      }),
    questId: z.string().nullable(),
    recurrence: z
      .enum([
        'none',
        'daily',
        'workdays',
        'weekends',
        'weekly',
        'weekly_specific',
        'monthly',
      ])
      .nullable(),
    weeklyDays: z
      .union([z.string().nullable(), z.array(z.number()).nullable()])
      .transform((val) => {
        if (val === null || val === undefined) return null;

        // If it's an array, convert to string
        if (Array.isArray(val)) {
          return val.join(',');
        }

        // If it's already a string, return it
        return val;
      }),
  });
export const insertDailyQuestParams = insertDailyQuestSchema.omit({});

export const updateDailyQuestSchema = createUpdateSchema(dailyQuests)
  .omit({
    createdAt: true,
  })
  .extend({
    status: z.enum(['open', 'completed']).nullable().optional(),
    recurrence: z
      .enum([
        'none',
        'daily',
        'workdays',
        'weekends',
        'weekly',
        'weekly_specific',
        'monthly',
      ])
      .nullable()
      .optional(),
    weeklyDays: z
      .union([z.string().nullable(), z.array(z.number()).nullable()])
      .optional()
      .transform((val) => {
        if (val === null || val === undefined) return null;

        // If it's an array, convert to string
        if (Array.isArray(val)) {
          return val.join(',');
        }

        // If it's already a string, return it
        return val;
      }),
  });
export const updateDailyQuestParams = updateDailyQuestSchema
  .extend({})
  .omit({});

export const dailyQuestIdSchema = baseSchema.pick({ id: true });

export const sortOptionsSchema = z.object({
  sortBy: z.enum(['title', 'dueDate', 'createdAt']).default('dueDate'),
  direction: z.enum(['asc', 'desc']).default('asc'),
});

export type DailyQuests = typeof dailyQuests.$inferSelect;
export type NewDailyQuest = z.infer<typeof insertDailyQuestSchema>;
export type NewDailyQuestParams = z.infer<typeof insertDailyQuestParams>;
export type UpdateDailyQuestParams = z.infer<typeof updateDailyQuestParams>;
export type DailyQuestId = z.infer<typeof dailyQuestIdSchema>['id'];
export type DailyQuestQueryParams = z.infer<typeof selectDailyQuestSchema>;
export type DailyQuestSortOptions = z.infer<typeof sortOptionsSchema>;

// this type infers the return from getQuests() - meaining it will include joins
export type CompleteDailyQuest = Awaited<
  ReturnType<typeof getDailyQuests>
>['dailyQuests'][number];
