-- AlterTable
ALTER TABLE "UserScore" ADD COLUMN     "totalScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "totalWilks" DOUBLE PRECISION NOT NULL DEFAULT 0;
