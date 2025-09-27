/*
  Warnings:

  - The primary key for the `Case` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `caseNumber` on the `Case` table. All the data in the column will be lost.
  - The `status` column on the `Case` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."CaseStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED');

-- CreateEnum
CREATE TYPE "public"."CasePriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropIndex
DROP INDEX "public"."Case_caseNumber_key";

-- AlterTable
ALTER TABLE "public"."Case" DROP CONSTRAINT "Case_pkey",
DROP COLUMN "caseNumber",
ADD COLUMN     "priority" "public"."CasePriority" NOT NULL DEFAULT 'LOW',
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "public"."CaseStatus" NOT NULL DEFAULT 'OPEN',
ADD CONSTRAINT "Case_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Case_id_seq";
