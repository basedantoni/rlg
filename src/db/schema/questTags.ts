import { sqliteTable, integer, primaryKey } from "drizzle-orm/sqlite-core";
import { quests } from "./quests";
import { tags } from "./tags";
import { relations } from "drizzle-orm";

export const questsTags = sqliteTable(
  "quests_tags",
  {
    questId: integer("quest_id")
      .notNull()
      .references(() => quests.id),
    tagId: integer("tag_id")
      .notNull()
      .references(() => tags.id),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.questId, table.tagId] }),
  }),
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
