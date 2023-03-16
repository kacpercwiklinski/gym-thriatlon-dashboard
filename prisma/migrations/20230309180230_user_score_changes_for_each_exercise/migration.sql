/*
  Warnings:

  - You are about to drop the column `exercise` on the `UserScore` table. All the data in the column will be lost.
  - You are about to drop the column `score` on the `UserScore` table. All the data in the column will be lost.
  - Added the required column `benchPressScore` to the `UserScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deadliftScore` to the `UserScore` table without a default value. This is not possible if the table is not empty.
  - Added the required column `squatScore` to the `UserScore` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserScore" DROP COLUMN "exercise",
DROP COLUMN "score",
ADD COLUMN     "benchPressScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "deadliftScore" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "squatScore" DOUBLE PRECISION NOT NULL;

-- DropEnum
DROP TYPE "Exercise";
