-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "CategoryName" AS ENUM ('nature-geography', 'plant-research', 'animal-protection', 'space-exploration', 'school-education', 'technology-invention', 'culture-history', 'language-evolution', 'entertainment-sports', 'objects-materials', 'fashion-trends', 'diet-health', 'architecture-places', 'transportation-travel', 'national-government', 'society-economy', 'laws-regulations', 'battlefield-contention', 'social-roles', 'behavior-actions', 'physical-mental-health', 'time-date');

-- CreateTable
CREATE TABLE "Article" (
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "readTimes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "id" SERIAL NOT NULL,
    "categoryName" "CategoryName",

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "name" "CategoryName" NOT NULL
);

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarkedArticles" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "MarkedArticles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReadedTimeCount" (
    "id" SERIAL NOT NULL,
    "times" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ReadedTimeCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rateLimit" (
    "id" TEXT NOT NULL,
    "key" TEXT,
    "count" INTEGER,
    "lastRequest" BIGINT,

    CONSTRAINT "rateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emailRateLimit" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "lastEmailSentAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emailRateLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Article_categoryName_idx" ON "Article"("categoryName");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "MarkedArticles_userId_articleId_idx" ON "MarkedArticles"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "MarkedArticles_userId_articleId_key" ON "MarkedArticles"("userId", "articleId");

-- CreateIndex
CREATE INDEX "ReadedTimeCount_userId_articleId_idx" ON "ReadedTimeCount"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "ReadedTimeCount_userId_articleId_key" ON "ReadedTimeCount"("userId", "articleId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "emailRateLimit_email_key" ON "emailRateLimit"("email");

-- CreateIndex
CREATE INDEX "emailRateLimit_email_idx" ON "emailRateLimit"("email");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkedArticles" ADD CONSTRAINT "MarkedArticles_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarkedArticles" ADD CONSTRAINT "MarkedArticles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadedTimeCount" ADD CONSTRAINT "ReadedTimeCount_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReadedTimeCount" ADD CONSTRAINT "ReadedTimeCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
