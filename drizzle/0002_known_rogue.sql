ALTER TABLE `users` MODIFY COLUMN `openId` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `stories` ADD `authorAvatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `clerkId` varchar(128);--> statement-breakpoint
ALTER TABLE `users` ADD `avatarUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `username` varchar(64);--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_clerkId_unique` UNIQUE(`clerkId`);