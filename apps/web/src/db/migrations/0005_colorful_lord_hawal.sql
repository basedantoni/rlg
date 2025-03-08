ALTER TABLE `level_definitions` RENAME COLUMN "xp_treshold" TO "xp_threshold";--> statement-breakpoint
ALTER TABLE `daily_quests` ADD `user_id` text REFERENCES users(id);