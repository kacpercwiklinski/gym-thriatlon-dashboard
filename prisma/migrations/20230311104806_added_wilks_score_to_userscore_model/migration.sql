-- AlterTable
ALTER TABLE "UserScore" ADD COLUMN     "benchPressWilks" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "deadliftWilks" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "squatWilks" DOUBLE PRECISION NOT NULL DEFAULT 0;