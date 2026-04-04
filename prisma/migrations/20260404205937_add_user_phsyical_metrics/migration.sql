-- AlterTable
ALTER TABLE "user" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "height" INTEGER;

-- CreateTable
CREATE TABLE "weight" (
    "id" TEXT NOT NULL,
    "weight" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "weight_userId_idx" ON "weight"("userId");

-- AddForeignKey
ALTER TABLE "weight" ADD CONSTRAINT "weight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
