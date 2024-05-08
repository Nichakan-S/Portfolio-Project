/*
  Warnings:

  - Added the required column `code` to the `Subjects` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subjects` ADD COLUMN `code` VARCHAR(20) NOT NULL,
    MODIFY `name` VARCHAR(100) NOT NULL;
