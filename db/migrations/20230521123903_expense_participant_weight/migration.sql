/*
  Warnings:

  - You are about to drop the column `multiplier` on the `ExpenseParticipant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ExpenseParticipant" DROP COLUMN "multiplier",
ADD COLUMN     "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0;
