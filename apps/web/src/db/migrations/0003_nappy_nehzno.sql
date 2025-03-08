PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text,
	`color` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "user_id", "name", "color", "created_at", "updated_at") SELECT "id", "user_id", "name", "color", "created_at", "updated_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_daily_quests` (
	`id` text PRIMARY KEY NOT NULL,
	`quest_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open',
	`due_date` text,
	`recurrence` text DEFAULT 'none',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_daily_quests`("id", "quest_id", "title", "description", "status", "due_date", "recurrence", "created_at", "updated_at") SELECT "id", "quest_id", "title", "description", "status", "due_date", "recurrence", "created_at", "updated_at" FROM `daily_quests`;--> statement-breakpoint
DROP TABLE `daily_quests`;--> statement-breakpoint
ALTER TABLE `__new_daily_quests` RENAME TO `daily_quests`;--> statement-breakpoint
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
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_quests`("id", "user_id", "category_id", "title", "description", "status", "due_date", "created_at", "updated_at") SELECT "id", "user_id", "category_id", "title", "description", "status", "due_date", "created_at", "updated_at" FROM `quests`;--> statement-breakpoint
DROP TABLE `quests`;--> statement-breakpoint
ALTER TABLE `__new_quests` RENAME TO `quests`;--> statement-breakpoint
CREATE TABLE `__new_rewards` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_rewards`("id", "name", "description", "created_at", "updated_at") SELECT "id", "name", "description", "created_at", "updated_at" FROM `rewards`;--> statement-breakpoint
DROP TABLE `rewards`;--> statement-breakpoint
ALTER TABLE `__new_rewards` RENAME TO `rewards`;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "name", "created_at", "updated_at") SELECT "id", "name", "created_at", "updated_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);