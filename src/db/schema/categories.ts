import { users } from "@/db/schema/users";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = sqliteTable("categories", {
        id: integer("id").primaryKey({ autoIncrement: true }),
        userId: integer("user_id").references(() => users.id),
        name: text("name"),
        color: text("color"),
        createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
        updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

const baseSchema = createSelectSchema(categories);

export const insertCategorySchema = createInsertSchema(categories).omit({
        createdAt: true,
        updatedAt: true,
});
export const insertCategoryParams = baseSchema.omit({ id: true });

export const updateCategorySchema = baseSchema;
export const updateCategoryParams = baseSchema.extend({}).omit({});
export const categoryIdSchema = baseSchema.pick({ id: true });

export type Categories = typeof categories.$inferSelect;
export type NewCategory = z.infer<typeof insertCategorySchema>;
export type NewCategoryParams = z.infer<typeof insertCategoryParams>;
export type UpdateCategoryParams = z.infer<typeof updateCategoryParams>;
export type CategoryId = z.infer<typeof categoryIdSchema>["id"];
