/*
  Warnings:

  - You are about to drop the column `user_image` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `user_image`,
    ADD COLUMN `userImage` LONGTEXT NULL;
