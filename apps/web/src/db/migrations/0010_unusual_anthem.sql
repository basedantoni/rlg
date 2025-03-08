PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_accountability_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`partnership_id` text,
	`penalty_amount` integer NOT NULL,
	`penalty_unit` text NOT NULL,
	`cutoff_time` text NOT NULL,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`partnership_id`) REFERENCES `accountability_partnerships`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_accountability_agreements`("id", "partnership_id", "penalty_amount", "penalty_unit", "cutoff_time", "status", "created_at", "updated_at") SELECT "id", "partnership_id", "penalty_amount", "penalty_unit", "cutoff_time", "status", "created_at", "updated_at" FROM `accountability_agreements`;--> statement-breakpoint
DROP TABLE `accountability_agreements`;--> statement-breakpoint
ALTER TABLE `__new_accountability_agreements` RENAME TO `accountability_agreements`;--> statement-breakpoint
PRAGMA foreign_keys=ON;