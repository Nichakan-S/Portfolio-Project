/*
  Warnings:

  - You are about to drop the column `Researchfund` on the `manageresearch` table. All the data in the column will be lost.
  - Added the required column `researchfund` to the `ManageResearch` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `manageresearch` DROP COLUMN `Researchfund`,
    ADD COLUMN `researchfund` VARCHAR(20) NOT NULL;
