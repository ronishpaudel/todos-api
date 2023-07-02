/*
  Warnings:

  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `todos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `todos` ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `user`;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(50) NULL,
    `name` VARCHAR(200) NOT NULL,
    `dob` DATETIME NULL,
    `email` VARCHAR(80) NOT NULL,
    `password` VARCHAR(50) NULL,
    `googleAuthToken` VARCHAR(50) NULL,
    `username` VARCHAR(50) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    UNIQUE INDEX `users_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `todos` ADD CONSTRAINT `todos_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
