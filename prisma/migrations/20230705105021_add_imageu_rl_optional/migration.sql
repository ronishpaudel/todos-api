/*
  Warnings:

  - You are about to alter the column `dob` on the `users` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.

*/
-- AlterTable
ALTER TABLE `todos` MODIFY `imageUrl` VARCHAR(200) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `dob` DATETIME NULL;
