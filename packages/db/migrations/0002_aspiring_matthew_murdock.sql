PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_level_definitions` (
	`id` text PRIMARY KEY NOT NULL,
	`level` integer NOT NULL,
	`xp_treshold` integer NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP)
);
--> statement-breakpoint
INSERT INTO `__new_level_definitions`("id", "level", "xp_treshold", "created_at", "updated_at") SELECT "id", "name", "description", "created_at", "updated_at" FROM `level_definitions`;--> statement-breakpoint
DROP TABLE `level_definitions`;--> statement-breakpoint
ALTER TABLE `__new_level_definitions` RENAME TO `level_definitions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `level_definitions_level_unique` ON `level_definitions` (`level`);
