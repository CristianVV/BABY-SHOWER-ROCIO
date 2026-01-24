-- CreateEnum
CREATE TYPE "GiftType" AS ENUM ('fundable', 'external', 'custom');

-- CreateEnum
CREATE TYPE "GiftStatus" AS ENUM ('available', 'partially_funded', 'completed', 'hidden');

-- CreateEnum
CREATE TYPE "ContributionStatus" AS ENUM ('pending', 'verified', 'rejected');

-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('bizum', 'revolut', 'bancolombia');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('EUR', 'COP');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gift" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "externalUrl" TEXT,
    "type" "GiftType" NOT NULL,
    "targetAmount" INTEGER,
    "currentAmount" INTEGER NOT NULL DEFAULT 0,
    "status" "GiftStatus" NOT NULL DEFAULT 'available',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "giftId" TEXT NOT NULL,
    "guestName" TEXT NOT NULL,
    "guestPhone" TEXT NOT NULL,
    "guestMessage" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "paymentMethod" "PaymentMethodType" NOT NULL,
    "status" "ContributionStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "type" "PaymentMethodType" NOT NULL,
    "label" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'settings',
    "guestPassword" TEXT NOT NULL DEFAULT 'Rocio2026',
    "adminPassword" TEXT NOT NULL DEFAULT 'AdminRocio2026',
    "eventTitle" TEXT NOT NULL DEFAULT 'Baby Shower de Rocío',
    "eventDate" TEXT NOT NULL DEFAULT '15 de febrero de 2026',
    "eventTime" TEXT NOT NULL DEFAULT '13:00h',
    "eventLocation" TEXT NOT NULL DEFAULT 'Calle de la Azalea, Alcobendas, Madrid',
    "heroMessage" TEXT NOT NULL DEFAULT 'Gracias por acompañarnos en esta celebración tan especial. Tu cariño y generosidad significan el mundo para nosotros.',
    "whatsappNumber" TEXT NOT NULL DEFAULT '+34649225590',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_type_key" ON "PaymentMethod"("type");

-- AddForeignKey
ALTER TABLE "Gift" ADD CONSTRAINT "Gift_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_giftId_fkey" FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
