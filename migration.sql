-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."Healthcheck" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Healthcheck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Trial',
    "firstLogin" BOOLEAN NOT NULL DEFAULT true,
    "subscriptionEnd" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Cargo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "pickupAddress" TEXT NOT NULL,
    "pickupCity" TEXT NOT NULL,
    "pickupCountry" TEXT NOT NULL,
    "pickupDate" TIMESTAMP(3) NOT NULL,
    "pickupTimeStart" TEXT,
    "pickupTimeEnd" TEXT,
    "deliveryAddress" TEXT NOT NULL,
    "deliveryCity" TEXT NOT NULL,
    "deliveryCountry" TEXT NOT NULL,
    "deliveryDate" TIMESTAMP(3) NOT NULL,
    "deliveryTimeStart" TEXT,
    "deliveryTimeEnd" TEXT,
    "weight" DOUBLE PRECISION,
    "volume" DOUBLE PRECISION,
    "cargoType" TEXT NOT NULL,
    "packaging" TEXT,
    "specialRequirements" TEXT,
    "estimatedValue" DOUBLE PRECISION,
    "budgetMin" DOUBLE PRECISION,
    "budgetMax" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cargo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Quote" (
    "id" TEXT NOT NULL,
    "cargoId" TEXT NOT NULL,
    "carrierId" TEXT NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "pricePerKm" DOUBLE PRECISION,
    "estimatedDistance" DOUBLE PRECISION,
    "vehicleType" TEXT NOT NULL,
    "estimatedPickupTime" TEXT,
    "estimatedDeliveryTime" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "validUntil" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Deal" (
    "id" TEXT NOT NULL,
    "cargoId" TEXT NOT NULL,
    "quoteId" TEXT NOT NULL,
    "shipperId" TEXT NOT NULL,
    "transporterId" TEXT NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Active',
    "progress" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "timeline" JSONB,
    "agreedPickupDate" TIMESTAMP(3),
    "agreedDeliveryDate" TIMESTAMP(3),
    "actualPickupDate" TIMESTAMP(3),
    "actualDeliveryDate" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatThread" (
    "id" TEXT NOT NULL,
    "dealId" TEXT,
    "quoteId" TEXT,
    "participants" JSONB NOT NULL,
    "title" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastMessageAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatThread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChatMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "messageType" TEXT NOT NULL DEFAULT 'text',
    "attachments" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChatMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'ro',
    "timezone" TEXT NOT NULL DEFAULT 'Europe/Bucharest',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "isProfilePublic" BOOLEAN NOT NULL DEFAULT true,
    "showLocation" BOOLEAN NOT NULL DEFAULT true,
    "showContactInfo" BOOLEAN NOT NULL DEFAULT false,
    "preferredVehicleTypes" JSONB,
    "operatingRegions" JSONB,
    "businessType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NotificationSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "emailNewQuotes" BOOLEAN NOT NULL DEFAULT true,
    "emailQuoteAccepted" BOOLEAN NOT NULL DEFAULT true,
    "emailNewMessages" BOOLEAN NOT NULL DEFAULT true,
    "emailDealUpdates" BOOLEAN NOT NULL DEFAULT true,
    "emailMarketing" BOOLEAN NOT NULL DEFAULT false,
    "pushNewQuotes" BOOLEAN NOT NULL DEFAULT true,
    "pushQuoteAccepted" BOOLEAN NOT NULL DEFAULT true,
    "pushNewMessages" BOOLEAN NOT NULL DEFAULT true,
    "pushDealUpdates" BOOLEAN NOT NULL DEFAULT true,
    "inAppNewQuotes" BOOLEAN NOT NULL DEFAULT true,
    "inAppQuoteAccepted" BOOLEAN NOT NULL DEFAULT true,
    "inAppNewMessages" BOOLEAN NOT NULL DEFAULT true,
    "inAppDealUpdates" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cargo_userId_idx" ON "public"."Cargo"("userId");

-- CreateIndex
CREATE INDEX "Cargo_status_idx" ON "public"."Cargo"("status");

-- CreateIndex
CREATE INDEX "Cargo_pickupCity_idx" ON "public"."Cargo"("pickupCity");

-- CreateIndex
CREATE INDEX "Cargo_deliveryCity_idx" ON "public"."Cargo"("deliveryCity");

-- CreateIndex
CREATE INDEX "Quote_cargoId_idx" ON "public"."Quote"("cargoId");

-- CreateIndex
CREATE INDEX "Quote_carrierId_idx" ON "public"."Quote"("carrierId");

-- CreateIndex
CREATE INDEX "Quote_status_idx" ON "public"."Quote"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_cargoId_key" ON "public"."Deal"("cargoId");

-- CreateIndex
CREATE UNIQUE INDEX "Deal_quoteId_key" ON "public"."Deal"("quoteId");

-- CreateIndex
CREATE INDEX "Deal_shipperId_idx" ON "public"."Deal"("shipperId");

-- CreateIndex
CREATE INDEX "Deal_transporterId_idx" ON "public"."Deal"("transporterId");

-- CreateIndex
CREATE INDEX "Deal_status_idx" ON "public"."Deal"("status");

-- CreateIndex
CREATE INDEX "ChatThread_dealId_idx" ON "public"."ChatThread"("dealId");

-- CreateIndex
CREATE INDEX "ChatThread_quoteId_idx" ON "public"."ChatThread"("quoteId");

-- CreateIndex
CREATE INDEX "ChatMessage_threadId_idx" ON "public"."ChatMessage"("threadId");

-- CreateIndex
CREATE INDEX "ChatMessage_senderId_idx" ON "public"."ChatMessage"("senderId");

-- CreateIndex
CREATE INDEX "ChatMessage_createdAt_idx" ON "public"."ChatMessage"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "public"."UserSettings"("userId");

-- CreateIndex
CREATE INDEX "UserSettings_userId_idx" ON "public"."UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationSettings_userId_key" ON "public"."NotificationSettings"("userId");

-- CreateIndex
CREATE INDEX "NotificationSettings_userId_idx" ON "public"."NotificationSettings"("userId");

-- AddForeignKey
ALTER TABLE "public"."Cargo" ADD CONSTRAINT "Cargo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "public"."Cargo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Quote" ADD CONSTRAINT "Quote_carrierId_fkey" FOREIGN KEY ("carrierId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "public"."Cargo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_shipperId_fkey" FOREIGN KEY ("shipperId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Deal" ADD CONSTRAINT "Deal_transporterId_fkey" FOREIGN KEY ("transporterId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatThread" ADD CONSTRAINT "ChatThread_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "public"."Deal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatThread" ADD CONSTRAINT "ChatThread_quoteId_fkey" FOREIGN KEY ("quoteId") REFERENCES "public"."Quote"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "public"."ChatThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NotificationSettings" ADD CONSTRAINT "NotificationSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

