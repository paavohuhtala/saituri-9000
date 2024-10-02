/*
  Warnings:

  - Added the required column `createdById` to the `GroupInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GroupInvite" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GroupInvite" ADD CONSTRAINT "GroupInvite_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
