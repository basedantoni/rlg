PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_quests_tags` (
	`daily_quest_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`daily_quest_id`, `tag_id`),
	FOREIGN KEY (`daily_quest_id`) REFERENCES `daily_quests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_daily_quests_tags`("daily_quest_id", "tag_id") SELECT "daily_quest_id", "tag_id" FROM `daily_quests_tags`;--> statement-breakpoint
DROP TABLE `daily_quests_tags`;--> statement-breakpoint
ALTER TABLE `__new_daily_quests_tags` RENAME TO `daily_quests_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_quests_tags` (
	`quest_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`quest_id`, `tag_id`),
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_quests_tags`("quest_id", "tag_id") SELECT "quest_id", "tag_id" FROM `quests_tags`;--> statement-breakpoint
DROP TABLE `quests_tags`;--> statement-breakpoint
ALTER TABLE `__new_quests_tags` RENAME TO `quests_tags`;