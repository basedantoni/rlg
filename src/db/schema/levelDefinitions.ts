import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { z } from "zod";

export const levelDefinitions = sqliteTable("level_definitions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
});

const baseSchema = createSelectSchema(levelDefinitions);

export const insertLevelDefinitionSchema = createInsertSchema(
  levelDefinitions,
).omit({
  createdAt: true,
  updatedAt: true,
});
export const insertLevelDefinitionParams = baseSchema.omit({ id: true });

export const updateLevelDefinitionSchema = createUpdateSchema(
  levelDefinitions,
).omit({
  id: true,
  createdAt: true,
});
export const updateLevelDefinitionParams = updateLevelDefinitionSchema
  .extend({})
  .omit({});

export const levelDefinitionIdSchema = baseSchema.pick({ id: true });

export type levelDefinitions = typeof levelDefinitions.$inferSelect;
export type NewlevelDefinition = z.infer<typeof insertLevelDefinitionSchema>;
export type NewlevelDefinitionParams = z.infer<
  typeof insertLevelDefinitionParams
>;
export type UpdatelevelDefinitionParams = z.infer<
  typeof updateLevelDefinitionParams
>;
export type levelDefinitionId = z.infer<typeof levelDefinitionIdSchema>["id"];
