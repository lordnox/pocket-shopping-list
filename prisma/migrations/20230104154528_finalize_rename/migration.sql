/*
  Warnings:

  - You are about to drop the `_ShoppingItemToShoppingItemTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ShoppingItemToShoppingItemTag" DROP CONSTRAINT "_ShoppingItemToShoppingItemTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ShoppingItemToShoppingItemTag" DROP CONSTRAINT "_ShoppingItemToShoppingItemTag_B_fkey";

-- AlterTable
ALTER TABLE "Product" RENAME CONSTRAINT "ShoppingItem_pkey" TO "Product_pkey";

-- DropTable
DROP TABLE "_ShoppingItemToShoppingItemTag";

-- CreateTable
CREATE TABLE "_ProductToShoppingItemTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProductToShoppingItemTag_AB_unique" ON "_ProductToShoppingItemTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ProductToShoppingItemTag_B_index" ON "_ProductToShoppingItemTag"("B");

-- RenameForeignKey
ALTER TABLE "Product" RENAME CONSTRAINT "ShoppingItem_userId_fkey" TO "Product_userId_fkey";

-- AddForeignKey
ALTER TABLE "_ProductToShoppingItemTag" ADD CONSTRAINT "_ProductToShoppingItemTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToShoppingItemTag" ADD CONSTRAINT "_ProductToShoppingItemTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER INDEX "ShoppingItem_name_key" RENAME TO "Product_name_key";
