PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accountability_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`partnership_id` text,
	`penalty_type` text,
	`penalty_amount` integer,
	`penalty_unit` text,
	`cutoff_time` text,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`partnership_id`) REFERENCES `accountability_partnerships`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_accountability_agreements`("id", "partnership_id", "penalty_type", "penalty_amount", "penalty_unit", "cutoff_time", "status", "created_at", "updated_at") SELECT "id", "partnership_id", "penalty_type", "penalty_amount", "penalty_unit", "cutoff_time", "status", "created_at", "updated_at" FROM `accountability_agreements`;--> statement-breakpoint
DROP TABLE `accountability_agreements`;--> statement-breakpoint
ALTER TABLE `__new_accountability_agreements` RENAME TO `accountability_agreements`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_accountability_partnerships` (
	`id` text PRIMARY KEY NOT NULL,
	`user1_id` text,
	`user2_id` text,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_accountability_partnerships`("id", "user1_id", "user2_id", "status", "created_at", "updated_at") SELECT "id", "user1_id", "user2_id", "status", "created_at", "updated_at" FROM `accountability_partnerships`;--> statement-breakpoint
DROP TABLE `accountability_partnerships`;--> statement-breakpoint
ALTER TABLE `__new_accountability_partnerships` RENAME TO `accountability_partnerships`;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`name` text,
	`color` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "user_id", "name", "color", "created_at", "updated_at") SELECT "id", "user_id", "name", "color", "created_at", "updated_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
CREATE TABLE `__new_daily_quests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`quest_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open',
	`due_date` text,
	`recurrence` text DEFAULT 'none',
	`weekly_days` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`quest_id`) REFERENCES `quests`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_daily_quests`("id", "user_id", "quest_id", "title", "description", "status", "due_date", "recurrence", "weekly_days", "created_at", "updated_at") SELECT "id", "user_id", "quest_id", "title", "description", "status", "due_date", "recurrence", "weekly_days", "created_at", "updated_at" FROM `daily_quests`;--> statement-breakpoint
DROP TABLE `daily_quests`;--> statement-breakpoint
ALTER TABLE `__new_daily_quests` RENAME TO `daily_quests`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text,
	`xp` integer,
	`level` integer,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "xp", "level", "created_at", "updated_at") SELECT "id", "name", "xp", "level", "created_at", "updated_at" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE TABLE `__new_level_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`level` integer NOT NULL,
	`xp_threshold` integer NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_level_definitions`("id", "level", "xp_threshold", "created_at", "updated_at") SELECT "id", "level", "xp_threshold", "created_at", "updated_at" FROM `level_definitions`;--> statement-breakpoint
DROP TABLE `level_definitions`;--> statement-breakpoint
ALTER TABLE `__new_level_definitions` RENAME TO `level_definitions`;--> statement-breakpoint
CREATE UNIQUE INDEX `level_definitions_level_unique` ON `level_definitions` (`level`);--> statement-breakpoint
CREATE TABLE `__new_quests` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`category_id` text,
	`title` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'open',
	`due_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_quests`("id", "user_id", "category_id", "title", "description", "status", "due_date", "created_at", "updated_at") SELECT "id", "user_id", "category_id", "title", "description", "status", "due_date", "created_at", "updated_at" FROM `quests`;--> statement-breakpoint
DROP TABLE `quests`;--> statement-breakpoint
ALTER TABLE `__new_quests` RENAME TO `quests`;--> statement-breakpoint
CREATE TABLE `__new_rewards` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_rewards`("id", "name", "description", "created_at", "updated_at") SELECT "id", "name", "description", "created_at", "updated_at" FROM `rewards`;--> statement-breakpoint
DROP TABLE `rewards`;--> statement-breakpoint
ALTER TABLE `__new_rewards` RENAME TO `rewards`;--> statement-breakpoint
CREATE TABLE `__new_tags` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
INSERT INTO `__new_tags`("id", "name", "created_at", "updated_at") SELECT "id", "name", "created_at", "updated_at" FROM `tags`;--> statement-breakpoint
DROP TABLE `tags`;--> statement-breakpoint
ALTER TABLE `__new_tags` RENAME TO `tags`;--> statement-breakpoint
CREATE UNIQUE INDEX `tags_name_unique` ON `tags` (`name`);--> statement-breakpoint
CREATE TABLE `__new_penalties` (
	`id` text PRIMARY KEY NOT NULL,
	`agreement_id` text,
	`user_id` text,
	`missed_quests_count` integer,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`agreement_id`) REFERENCES `accountability_agreements`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_penalties`("id", "agreement_id", "user_id", "missed_quests_count", "status", "created_at", "updated_at") SELECT "id", "agreement_id", "user_id", "missed_quests_count", "status", "created_at", "updated_at" FROM `penalties`;--> statement-breakpoint
DROP TABLE `penalties`;--> statement-breakpoint
ALTER TABLE `__new_penalties` RENAME TO `penalties`;