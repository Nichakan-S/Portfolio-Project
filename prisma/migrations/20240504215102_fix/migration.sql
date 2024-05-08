/*
  Warnings:

  - You are about to alter the column `term` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3)` to `UnsignedInt`.
  - You are about to alter the column `year` on the `subjects` table. The data in that column could be lost. The data in that column will be cast from `VarChar(6)` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `subjects` MODIFY `term` INTEGER UNSIGNED NOT NULL,
    MODIFY `year` INTEGER UNSIGNED NOT NULL;
