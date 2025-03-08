import { sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";
import { quests } from "./quests";
import { tags } from "./tags";
import { relations } from "drizzle-orm";

export const questsTags = sqliteTable(
  "quests_tags",
  {
    questId: text("quest_id")
      .notNull()
      .references(() => quests.id, { onDelete: "cascade" }),
    tagId: text("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.questId, table.tagId] }),
  })
);

export const questsTagsRelation = relations(questsTags, ({ one }) => ({
  dailyQuest: one(quests, {
    fields: [questsTags.questId],
    references: [quests.id],
  }),
  tag: one(tags, {
    fields: [questsTags.tagId],
    references: [tags.id],
  }),
}));
