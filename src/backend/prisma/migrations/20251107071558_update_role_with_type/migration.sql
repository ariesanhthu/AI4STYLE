/*
  Warnings:

  - Added the required column `type` to the `roles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "roles" ADD COLUMN     "type" TEXT NOT NULL;
