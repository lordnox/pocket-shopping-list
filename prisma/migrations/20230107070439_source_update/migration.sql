/*
  Warnings:

  - You are about to drop the column `locationId` on the `ProductPrice` table. All the data in the column will be lost.
  - You are about to drop the `GeoLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_locationId_fkey";

-- AlterTable
ALTER TABLE "ProductPrice" DROP COLUMN "locationId",
ADD COLUMN     "sourceId" TEXT;

-- DropTable
DROP TABLE "GeoLocation";

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "geoLocationId" TEXT,
    "webShopId" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoLocationSource" (
    "id" TEXT NOT NULL,
    "lat" INTEGER NOT NULL,
    "long" INTEGER NOT NULL,

    CONSTRAINT "GeoLocationSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebShopSource" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "WebShopSource_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD CONSTRAINT "ProductPrice_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "Source"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_geoLocationId_fkey" FOREIGN KEY ("geoLocationId") REFERENCES "GeoLocationSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_webShopId_fkey" FOREIGN KEY ("webShopId") REFERENCES "WebShopSource"("id") ON DELETE SET NULL ON UPDATE CASCADE;
