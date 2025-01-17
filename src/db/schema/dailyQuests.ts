import { quests } from "./quests";
import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { nanoid } from "nanoid";
import { z } from "zod";

export const dailyQuests = sqliteTable("daily_quests", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  questId: text("quest_id").references(() => quests.id),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").$type<"open" | "completed">().default("open"),
  dueDate: text("due_date"),
  recurrence: text("recurrence")
    .$type<"none" | "daily" | "workdays" | "weekends" | "weekly" | "monthly">()
    .default("none"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

const baseSchema = createSelectSchema(dailyQuests);

export const insertDailyQuestSchema = createInsertSchema(dailyQuests)
  .omit({
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    status: z.enum(["open", "completed"]).optional(),
    recurrence: z
      .enum(["none", "daily", "workdays", "weekends", "weekly", "monthly"])
      .optional(),
  });
export const insertDailyQuestParams = insertDailyQuestSchema.omit({ id: true });

export const updateDailyQuestSchema = createUpdateSchema(dailyQuests).omit({
  id: true,
  createdAt: true,
});
export const updateDailyQuestParams = updateDailyQuestSchema
  .extend({})
  .omit({});

export const dailyQuestIdSchema = baseSchema.pick({ id: true });

export type DailyQuests = typeof dailyQuests.$inferSelect;
export type NewDailyQuest = z.infer<typeof insertDailyQuestSchema>;
export type NewDailyQuestParams = z.infer<typeof insertDailyQuestParams>;
export type UpdateQuestParams = z.infer<typeof updateDailyQuestParams>;
export type DailyQuestId = z.infer<typeof dailyQuestIdSchema>["id"];
