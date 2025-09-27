/*
  Warnings:

  - Made the column `dueDate` on table `Case` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Case" ALTER COLUMN "dueDate" SET NOT NULL;
