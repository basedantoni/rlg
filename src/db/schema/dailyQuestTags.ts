import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { tags } from "./tags";
import { dailyQuests } from "./dailyQuests";
import { relations } from "drizzle-orm";

export const dailyQuestsTags = sqliteTable(
        "daily_quests_tags",
        {
                dailyQuestId: integer("daily_quest_id").notNull().references(() => dailyQuests.id),
                tagId: integer("tag_id").notNull().references(() => tags.id),
        },
        (table) => ({
                pk: primaryKey({ columns: [table.dailyQuestId, table.tagId] }),
        })
);

export const dailyQuestsTagsRelation = relations(dailyQuestsTags, ({ one }) => ({
        dailyQuest: one(dailyQuests, {
                fields: [dailyQuestsTags.dailyQuestId],
                references: [dailyQuests.id]
        }),
        tag: one(tags, {
                fields: [dailyQuestsTags.tagId],
                references: [tags.id]
        })
}))