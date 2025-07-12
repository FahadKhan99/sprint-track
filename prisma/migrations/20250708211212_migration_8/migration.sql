/*
  Warnings:

  - Made the column `description` on table `Issue` required. This step will fail if there are existing NULL values in that column.
  - Made the column `assigneeId` on table `Issue` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Issue" DROP CONSTRAINT "Issue_assigneeId_fkey";

-- AlterTable
ALTER TABLE "Issue" ALTER COLUMN "description" SET NOT NULL,
ALTER COLUMN "assigneeId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Sprint" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdBy" TEXT,
ADD COLUMN     "goal" TEXT;

-- AddForeignKey
ALTER TABLE "Issue" ADD CONSTRAINT "Issue_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("clerkUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
