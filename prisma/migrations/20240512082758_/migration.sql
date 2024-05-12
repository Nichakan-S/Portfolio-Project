/*
  Warnings:

  - You are about to drop the `activity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manageactivity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `manageresearch` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_facultyId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_majorId_fkey`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_rankId_fkey`;

-- DropIndex
DROP INDEX `Teaching_subjectsId_fkey` ON `Teaching`;

-- DropIndex
DROP INDEX `Teaching_userId_fkey` ON `Teaching`;

-- DropTable
DROP TABLE `activity`;

-- DropTable
DROP TABLE `manageactivity`;

-- DropTable
DROP TABLE `manageresearch`;

-- DropTable
DROP TABLE `subjects`;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `rankId` INTEGER UNSIGNED NOT NULL,
    `facultyId` INTEGER UNSIGNED NOT NULL,
    `majorId` INTEGER UNSIGNED NOT NULL,
    `prefix` VARCHAR(15) NOT NULL,
    `user_image` LONGTEXT NULL,
    `username` VARCHAR(100) NOT NULL,
    `lastname` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'user') NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subjects` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `code` VARCHAR(20) NOT NULL,
    `day` ENUM('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun') NOT NULL,
    `group` VARCHAR(6) NOT NULL,
    `starttime` VARCHAR(10) NOT NULL,
    `endtime` VARCHAR(10) NOT NULL,
    `term` INTEGER UNSIGNED NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Activity` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` ENUM('culture', 'service') NOT NULL,
    `name` VARCHAR(70) NOT NULL,
    `file` LONGTEXT NULL,
    `start` DATETIME(3) NOT NULL,
    `end` DATETIME(3) NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ManageActivity` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `activityId` INTEGER UNSIGNED NOT NULL,
    `userId` INTEGER UNSIGNED NOT NULL,
    `file` LONGTEXT NULL,
    `status` ENUM('wait', 'pass', 'fail') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ManageResearch` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `userId` INTEGER UNSIGNED NOT NULL,
    `nameTH` VARCHAR(50) NOT NULL,
    `nameEN` VARCHAR(50) NOT NULL,
    `researchfund` VARCHAR(20) NOT NULL,
    `type` ENUM('journalism', 'researchreports', 'posterpresent') NOT NULL,
    `year` INTEGER UNSIGNED NOT NULL,
    `file` LONGTEXT NULL,
    `status` ENUM('wait', 'pass', 'fail') NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_rankId_fkey` FOREIGN KEY (`rankId`) REFERENCES `Rank`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_facultyId_fkey` FOREIGN KEY (`facultyId`) REFERENCES `Faculty`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_majorId_fkey` FOREIGN KEY (`majorId`) REFERENCES `Major`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teaching` ADD CONSTRAINT `Teaching_subjectsId_fkey` FOREIGN KEY (`subjectsId`) REFERENCES `Subjects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Teaching` ADD CONSTRAINT `Teaching_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManageActivity` ADD CONSTRAINT `ManageActivity_activityId_fkey` FOREIGN KEY (`activityId`) REFERENCES `Activity`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManageActivity` ADD CONSTRAINT `ManageActivity_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ManageResearch` ADD CONSTRAINT `ManageResearch_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
