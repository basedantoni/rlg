import { users } from '#db/schema/users';
import { sql } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod';
import { nanoid } from 'nanoid';
import { z } from 'zod';

export const categories = sqliteTable('categories', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text('user_id').references(() => users.id),
  name: text('name'),
  color: text('color'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
});

const baseSchema = createSelectSchema(categories);

export const insertCategorySchema = createInsertSchema(categories).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertCategoryParams = insertCategorySchema.omit({
  id: true,
  userId: true,
});

export const updateCategorySchema = createUpdateSchema(categories).omit({
  createdAt: true,
});
export const updateCategoryParams = updateCategorySchema.extend({}).omit({});

export const categoryIdSchema = baseSchema.pick({ id: true });

export type Category = typeof categories.$inferSelect;
export type NewCategory = z.infer<typeof insertCategorySchema>;
export type NewCategoryParams = z.infer<typeof insertCategoryParams>;
export type UpdateCategoryParams = z.infer<typeof updateCategoryParams>;
export type CategoryId = z.infer<typeof categoryIdSchema>['id'];
