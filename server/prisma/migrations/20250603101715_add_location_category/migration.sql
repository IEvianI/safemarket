-- AlterTable
ALTER TABLE "Listing" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'autre',
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'non précisé';
