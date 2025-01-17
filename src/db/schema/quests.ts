import { users } from "@/db/schema/users";
import { categories } from "@/db/schema/categories";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";

export const quests = sqliteTable("quests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  userId: text("user_id").references(() => users.id),
  categoryId: text("category_id").references(() => categories.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").$type<"open" | "completed">().default("open"),
  dueDate: text("due_date"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

const baseSchema = createSelectSchema(quests);

export const insertQuestSchema = createInsertSchema(quests)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    status: z.enum(["open", "completed"]).optional(),
  });
export const insertQuestParams = insertQuestSchema.omit({
  id: true,
  userId: true,
  categoryId: true,
});

export const updateQuestSchema = createUpdateSchema(quests).omit({
  createdAt: true,
});
export const updateQuestParams = updateQuestSchema.extend({}).omit({});

export const questIdSchema = baseSchema.pick({ id: true });

export type Quests = typeof quests.$inferSelect;
export type NewQuest = z.infer<typeof insertQuestSchema>;
export type NewQuestParams = z.infer<typeof insertQuestParams>;
export type UpdateQuestParams = z.infer<typeof updateQuestParams>;
export type QuestId = z.infer<typeof questIdSchema>["id"];
