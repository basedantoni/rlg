PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_daily_quests_tags` (
	`daily_quest_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`daily_quest_id`, `tag_id`),
	FOREIGN KEY (`daily_quest_id`) REFERENCES `daily_quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_daily_quests_tags`("daily_quest_id", "tag_id") SELECT "daily_quest_id", "tag_id" FROM `daily_quests_tags`;--> statement-breakpoint
DROP TABLE `daily_quests_tags`;--> statement-breakpoint
ALTER TABLE `__new_daily_quests_tags` RENAME TO `daily_quests_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_daily_quests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`quest_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open',
	`due_date` text,
	`recurrence` text DEFAULT 'none',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_daily_quests`("id", "user_id", "quest_id", "title", "description", "status", "due_date", "recurrence", "created_at", "updated_at") SELECT "id", "user_id", "quest_id", "title", "description", "status", "due_date", "recurrence", "created_at", "updated_at" FROM `daily_quests`;--> statement-breakpoint
DROP TABLE `daily_quests`;--> statement-breakpoint
ALTER TABLE `__new_daily_quests` RENAME TO `daily_quests`;--> statement-breakpoint
CREATE TABLE `__new_quests_tags` (
	`quest_id` text NOT NULL,
	`tag_id` text NOT NULL,
	PRIMARY KEY(`quest_id`, `tag_id`),
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_quests_tags`("quest_id", "tag_id") SELECT "quest_id", "tag_id" FROM `quests_tags`;--> statement-breakpoint
DROP TABLE `quests_tags`;--> statement-breakpoint
ALTER TABLE `__new_quests_tags` RENAME TO `quests_tags`;--> statement-breakpoint
CREATE TABLE `__new_quests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`category_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open',
	`due_date` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_quests`("id", "user_id", "category_id", "title", "description", "status", "due_date", "created_at", "updated_at") SELECT "id", "user_id", "category_id", "title", "description", "status", "due_date", "created_at", "updated_at" FROM `quests`;--> statement-breakpoint
DROP TABLE `quests`;--> statement-breakpoint
ALTER TABLE `__new_quests` RENAME TO `quests`;