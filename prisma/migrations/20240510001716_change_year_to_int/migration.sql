/*
  Warnings:

  - You are about to alter the column `year` on the `activity` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `UnsignedInt`.
  - You are about to alter the column `year` on the `manageresearch` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `UnsignedInt`.

*/
-- AlterTable
ALTER TABLE `activity` MODIFY `year` INTEGER UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `manageresearch` MODIFY `year` INTEGER UNSIGNED NOT NULL;
