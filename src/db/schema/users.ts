import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema, createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
        id: text("id").primaryKey(),
        name: text("name"),
        xp: integer("xp"),
        level: integer("level"),
        createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
        updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

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
export type UserId = z.infer<typeof userIdSchema>["id"];
