import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { questsTags } from "./questTags";
import { dailyQuestsTags } from "./dailyQuestTags";

export const tags = sqliteTable("tags", {
        id: integer("id").primaryKey({ autoIncrement: true }),
        name: text("name").notNull().unique(),
        createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
        updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
})

export const tagsRelations = relations(tags, ({ many }) => ({
        questsTags: many(questsTags),
        dailyQuestsTags: many(dailyQuestsTags),
}));

const baseSchema = createSelectSchema(tags);

export const insertTagSchema = createInsertSchema(tags).omit({
        createdAt: true,
        updatedAt: true,
})
export const insertTagParams = baseSchema.omit({ id: true });

export const updateTagSchema = baseSchema;
export const updateTagParams = baseSchema.extend({}).omit({});
export const tagIdSchema = baseSchema.pick({ id: true });

export type Tags = typeof tags.$inferSelect;
export type NewTag = z.infer<typeof insertTagSchema>;
export type NewTagParams = z.infer<typeof insertTagParams>;
export type UpdateTagParams = z.infer<typeof updateTagParams>;
export type TagId = z.infer<typeof tagIdSchema>["id"];

