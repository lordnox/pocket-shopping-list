/*
  Warnings:

  - You are about to drop the column `lat` on the `GeoLocationSource` table. All the data in the column will be lost.
  - You are about to drop the column `long` on the `GeoLocationSource` table. All the data in the column will be lost.
  - Added the required column `accuracy` to the `GeoLocationSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `GeoLocationSource` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `GeoLocationSource` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GeoLocationSource" DROP COLUMN "lat",
DROP COLUMN "long",
ADD COLUMN     "accuracy" INTEGER NOT NULL,
ADD COLUMN     "latitude" INTEGER NOT NULL,
ADD COLUMN     "longitude" INTEGER NOT NULL;
