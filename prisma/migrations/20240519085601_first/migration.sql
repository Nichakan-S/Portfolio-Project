-- CreateTable
CREATE TABLE `Faculty` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `facultyName` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Major` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `facultyId` INTEGER UNSIGNED NOT NULL,
    `majorName` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Position` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `audit` BOOLEAN NOT NULL DEFAULT false,
    `employee` BOOLEAN NOT NULL DEFAULT false,
    `approveResearch` BOOLEAN NOT NULL DEFAULT false,
    `approveActivity` BOOLEAN NOT NULL DEFAULT false,
    `overview` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `positionId` INTEGER UNSIGNED NOT NULL,
    `majorId` INTEGER UNSIGNED NOT NULL,
    `prefix` VARCHAR(10) NOT NULL,
    `userImage` LONGTEXT NULL,
    `username` VARCHAR(40) NOT NULL,
    `lastname` VARCHAR(40) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `password` VARCHAR(128) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Teaching` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `starttime` VARCHAR(10) NOT NULL,
    `endtime` VARCHAR(10) NOT NULL,
    `day` ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun') NOT NULL,
    `group` VARCHAR(3) NOT NULL,
    `term` INTEGER UNSIGNED NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,
    `audit` ENUM('wait', 'pass', 'fail') NOT NULL,
    `subjectsId` INTEGER UNSIGNED NOT NULL,
    `userId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subjects` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `nameTH` VARCHAR(60) NOT NULL,
    `nameEN` VARCHAR(60) NOT NULL,
    `code` VARCHAR(8) NOT NULL,
    `majorId` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActivityHeader` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('culture', 'service', 'other') NOT NULL,
    `name` VARCHAR(70) NOT NULL,
    `file` LONGTEXT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `activityRole` ENUM('operator', 'joiner') NOT NULL,
    `activityId` INTEGER UNSIGNED NOT NULL,
    `userId` INTEGER UNSIGNED NOT NULL,
    `file` LONGTEXT NULL,
    `audit` ENUM('wait', 'pass', 'fail') NOT NULL,
    `approve` ENUM('wait', 'pass', 'fail') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Research` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `nameTH` VARCHAR(50) NOT NULL,
    `nameEN` VARCHAR(50) NOT NULL,
    `researchFund` VARCHAR(20) NOT NULL,
    `type` ENUM('journalism', 'researchreports', 'posterpresent') NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,
    `file` LONGTEXT NULL,
    `audit` ENUM('wait', 'pass', 'fail') NOT NULL,
    `approve` ENUM('wait', 'pass', 'fail') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Major` ADD CONSTRAINT `Major_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teaching` ADD CONSTRAINT `Teaching_subjectsId_fkey` FOREIGN KEY (`subjectsId`) REFERENCES `Subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teaching` ADD CONSTRAINT `Teaching_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subjects` ADD CONSTRAINT `Subjects_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `ActivityHeader`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Activity` ADD CONSTRAINT `Activity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Research` ADD CONSTRAINT `Research_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
