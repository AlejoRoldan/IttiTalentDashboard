CREATE TABLE `ai_recommendations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int,
	`type` enum('organizational','individual','mentorship') NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`priority` enum('low','medium','high','critical') DEFAULT 'medium',
	`status` enum('pending','reviewed','implemented','dismissed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_recommendations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`category` enum('technical','soft') NOT NULL,
	`description` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `competencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `development_milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`planId` int NOT NULL,
	`month` int NOT NULL,
	`description` text,
	`metric` text,
	`status` enum('pending','in_progress','completed','delayed') DEFAULT 'pending',
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `development_milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `development_plans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`objective` text,
	`strengths` text,
	`emergingAreas` text,
	`latentPotential` text,
	`limitingFactors` text,
	`startDate` timestamp,
	`endDate` timestamp,
	`status` enum('draft','active','completed','archived') DEFAULT 'draft',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `development_plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_competencies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`competencyId` int NOT NULL,
	`currentLevel` int NOT NULL DEFAULT 0,
	`potentialLevel` int NOT NULL DEFAULT 0,
	`status` enum('manifested','emerging','latent','not_evaluated') DEFAULT 'not_evaluated',
	`lastEvaluated` timestamp,
	`evaluatedBy` int,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employee_competencies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employee_opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`opportunityId` int NOT NULL,
	`assignedAt` timestamp NOT NULL DEFAULT (now()),
	`status` enum('pending','in_progress','completed') DEFAULT 'pending',
	CONSTRAINT `employee_opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`name` varchar(255) NOT NULL,
	`email` varchar(320),
	`role` varchar(100),
	`bootcamp` varchar(100),
	`seniority` enum('junior','mid','senior','lead'),
	`department` varchar(100),
	`position` varchar(100),
	`joinDate` timestamp,
	`managerId` int,
	`avatar` text,
	`bio` text,
	`industryInterest` text,
	`careerGoal` enum('technical_expert','tech_lead','mentor','manager','entrepreneur'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `mentorships` (
	`id` int AUTO_INCREMENT NOT NULL,
	`menteeId` int NOT NULL,
	`mentorId` int NOT NULL,
	`planId` int,
	`frequency` varchar(100),
	`startDate` timestamp,
	`endDate` timestamp,
	`status` enum('active','completed','paused') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mentorships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`type` enum('technical','mentoring','leadership') NOT NULL,
	`industry` varchar(100),
	`timing` enum('immediate','3_6_months','6_12_months'),
	`developmentLevel` enum('entry','intermediate','advanced'),
	`requiredCompetencies` text,
	`status` enum('open','assigned','closed') DEFAULT 'open',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `progress_indicators` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`learningSpeed` int DEFAULT 0,
	`skillApplication` int DEFAULT 0,
	`teamImpact` int DEFAULT 0,
	`consistency` int DEFAULT 0,
	`mentoringOffered` int DEFAULT 0,
	`initiative` int DEFAULT 0,
	`adaptability` int DEFAULT 0,
	`recordedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `progress_indicators_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `talent_detectors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`source` enum('github','community','mentor_feedback','portfolio','brainstorming','learning_speed','questions_quality','peer_mentoring','problem_solving','creativity','teaching','improvement_initiatives') NOT NULL,
	`description` text,
	`detectedAt` timestamp NOT NULL DEFAULT (now()),
	`detectedBy` int,
	CONSTRAINT `talent_detectors_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `ai_recommendations` ADD CONSTRAINT `ai_recommendations_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `development_milestones` ADD CONSTRAINT `development_milestones_planId_development_plans_id_fk` FOREIGN KEY (`planId`) REFERENCES `development_plans`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `development_plans` ADD CONSTRAINT `development_plans_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_competencies` ADD CONSTRAINT `employee_competencies_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_competencies` ADD CONSTRAINT `employee_competencies_competencyId_competencies_id_fk` FOREIGN KEY (`competencyId`) REFERENCES `competencies`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_competencies` ADD CONSTRAINT `employee_competencies_evaluatedBy_users_id_fk` FOREIGN KEY (`evaluatedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_opportunities` ADD CONSTRAINT `employee_opportunities_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employee_opportunities` ADD CONSTRAINT `employee_opportunities_opportunityId_opportunities_id_fk` FOREIGN KEY (`opportunityId`) REFERENCES `opportunities`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `employees` ADD CONSTRAINT `employees_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mentorships` ADD CONSTRAINT `mentorships_menteeId_employees_id_fk` FOREIGN KEY (`menteeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mentorships` ADD CONSTRAINT `mentorships_mentorId_employees_id_fk` FOREIGN KEY (`mentorId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `mentorships` ADD CONSTRAINT `mentorships_planId_development_plans_id_fk` FOREIGN KEY (`planId`) REFERENCES `development_plans`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `progress_indicators` ADD CONSTRAINT `progress_indicators_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `talent_detectors` ADD CONSTRAINT `talent_detectors_employeeId_employees_id_fk` FOREIGN KEY (`employeeId`) REFERENCES `employees`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `talent_detectors` ADD CONSTRAINT `talent_detectors_detectedBy_users_id_fk` FOREIGN KEY (`detectedBy`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;