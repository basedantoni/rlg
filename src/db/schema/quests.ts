import { users } from "@/db/schema/users";
import { categories } from "@/db/schema/categories";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const quests = sqliteTable("quests", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").references(() => users.id),
  categoryId: integer("category_id").references(() => categories.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").$type<"open" | "completed">().default("open"),
  dueDate: text("due_date"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

const baseSchema = createSelectSchema(quests);

export const insertQuestSchema = createInsertSchema(quests).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertQuestParams = baseSchema.omit({ id: true });

export const updateQuestSchema = createUpdateSchema(quests).omit({
  id: true,
  createdAt: true,
});
export const updateQuestParams = updateQuestSchema.extend({}).omit({});

export const questIdSchema = baseSchema.pick({ id: true });

export type Quests = typeof quests.$inferSelect;
export type NewQuest = z.infer<typeof insertQuestSchema>;
export type NewQuestParams = z.infer<typeof insertQuestParams>;
export type UpdateQuestParams = z.infer<typeof updateQuestParams>;
export type QuestId = z.infer<typeof questIdSchema>["id"];
