CREATE TABLE `community_apps` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`android` text NOT NULL,
	`spots` integer NOT NULL,
	`link` text NOT NULL,
	`instructions` text NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`owner`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `community_apps_created` ON `community_apps` (`created`);--> statement-breakpoint
CREATE TABLE `community_feedback` (
	`id` text PRIMARY KEY NOT NULL,
	`app` text NOT NULL,
	`member` text NOT NULL,
	`body` text NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`app`) REFERENCES `community_apps`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `community_requests` (
	`app` text NOT NULL,
	`member` text NOT NULL,
	`play_email` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	PRIMARY KEY(`app`, `member`),
	FOREIGN KEY (`app`) REFERENCES `community_apps`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`member`) REFERENCES `members`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `community_requests_member` ON `community_requests` (`member`);