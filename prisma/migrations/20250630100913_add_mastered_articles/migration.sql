-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "wordsCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "MasteredArticle" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MasteredArticle_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MasteredArticle_userId_articleId_idx" ON "MasteredArticle"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "MasteredArticle_userId_articleId_key" ON "MasteredArticle"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "MasteredArticle" ADD CONSTRAINT "MasteredArticle_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasteredArticle" ADD CONSTRAINT "MasteredArticle_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
