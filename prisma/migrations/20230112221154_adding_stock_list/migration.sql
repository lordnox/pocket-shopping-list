-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "stockListId" TEXT;

-- CreateTable
CREATE TABLE "StockList" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "StockList_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StockList_name_key" ON "StockList"("name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_stockListId_fkey" FOREIGN KEY ("stockListId") REFERENCES "StockList"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockList" ADD CONSTRAINT "StockList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
