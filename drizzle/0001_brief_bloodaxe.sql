CREATE TABLE `newsletterDeliveries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`storyId` int NOT NULL,
	`subscriberId` int NOT NULL,
	`provider` varchar(48) NOT NULL DEFAULT 'resend',
	`status` enum('queued','sent','failed') NOT NULL DEFAULT 'queued',
	`providerMessageId` varchar(320),
	`errorMessage` text,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `newsletterDeliveries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscribers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`displayName` varchar(160),
	`status` enum('subscribed','unsubscribed') NOT NULL DEFAULT 'subscribed',
	`consentAt` timestamp NOT NULL DEFAULT (now()),
	`unsubscribeToken` varchar(96) NOT NULL,
	`unsubscribedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscribers_id` PRIMARY KEY(`id`),
	CONSTRAINT `subscribers_email_unique` UNIQUE(`email`),
	CONSTRAINT `subscribers_unsubscribeToken_unique` UNIQUE(`unsubscribeToken`)
);
--> statement-breakpoint
ALTER TABLE `stories` ADD `richContentJson` text;--> statement-breakpoint
ALTER TABLE `newsletterDeliveries` ADD CONSTRAINT `newsletterDeliveries_storyId_stories_id_fk` FOREIGN KEY (`storyId`) REFERENCES `stories`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `newsletterDeliveries` ADD CONSTRAINT `newsletterDeliveries_subscriberId_subscribers_id_fk` FOREIGN KEY (`subscriberId`) REFERENCES `subscribers`(`id`) ON DELETE no action ON UPDATE no action;