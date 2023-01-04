/*
  Warnings:

  - You are about to drop the `_ProductToShoppingItemTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ProductToShoppingItemTag" DROP CONSTRAINT "_ProductToShoppingItemTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToShoppingItemTag" DROP CONSTRAINT "_ProductToShoppingItemTag_B_fkey";

-- AlterTable
ALTER TABLE "ProductPrice" RENAME CONSTRAINT "ItemPrice_pkey" TO "ProductPrice_pkey";

-- DropTable
DROP TABLE "_ProductToShoppingItemTag";

-- CreateTable
CREATE TABLE "_ProductToProductTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToProductTag_AB_unique" ON "_ProductToProductTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToProductTag_B_index" ON "_ProductToProductTag"("B");

-- RenameForeignKey
ALTER TABLE "ProductPrice" RENAME CONSTRAINT "ItemPrice_itemId_fkey" TO "ProductPrice_itemId_fkey";

-- RenameForeignKey
ALTER TABLE "ProductPrice" RENAME CONSTRAINT "ItemPrice_locationId_fkey" TO "ProductPrice_locationId_fkey";

-- RenameForeignKey
ALTER TABLE "ProductPrice" RENAME CONSTRAINT "ItemPrice_userId_fkey" TO "ProductPrice_userId_fkey";

-- AddForeignKey
ALTER TABLE "_ProductToProductTag" ADD CONSTRAINT "_ProductToProductTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProductTag" ADD CONSTRAINT "_ProductToProductTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
