CREATE TABLE `accountability_agreements` (
	`id` text PRIMARY KEY NOT NULL,
	`partnership_id` text,
	`penalty_type` text,
	`penalty_amount` integer,
	`penalty_unit` text,
	`cutoff_time` text,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`partnership_id`) REFERENCES `accountability_partnerships`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `accountability_partnerships` (
	`id` text PRIMARY KEY NOT NULL,
	`user1_id` text,
	`user2_id` text,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`user1_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`user2_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE TABLE `penalties` (
	`id` text PRIMARY KEY NOT NULL,
	`agreement_id` text,
	`user_id` text,
	`missed_quests_count` integer,
	`status` text DEFAULT 'active',
	`created_at` text DEFAULT (CURRENT_TIMESTAMP),
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP),
	FOREIGN KEY (`agreement_id`) REFERENCES `accountability_agreements`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
