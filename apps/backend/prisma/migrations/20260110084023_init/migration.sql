-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CUSTOMER', 'STAFF', 'MANAGER');

-- CreateEnum
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'RENTED', 'MAINTENANCE', 'RETIRED');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'CHECKED_OUT', 'RETURNED');

-- CreateEnum
CREATE TYPE "PaymentKind" AS ENUM ('HOLDING', 'FULL', 'DEPOSIT', 'REFUND', 'FEE');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED', 'VOID');

-- CreateEnum
CREATE TYPE "ReturnStage" AS ENUM ('INSPECTION', 'REPAIR', 'SERVICE', 'CLEANING', 'VALUATION', 'COMPLETE');

-- CreateEnum
CREATE TYPE "ValuationDecision" AS ENUM ('RETURN_TO_INVENTORY', 'RETIRE', 'WRITE_OFF');

-- CreateEnum
CREATE TYPE "SourceCategory" AS ENUM ('LONG_CREDIT', 'QUICK_TURNAROUND', 'NEW_UNTESTED');

-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('VEHICLE', 'ADDON');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT,
    "phone" TEXT,
    "dob" TIMESTAMP(3),
    "licenseIssuedAt" TIMESTAMP(3),
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseDailyRate" DECIMAL(10,2),

    CONSTRAINT "VehicleCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "vin" TEXT,
    "plate" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "color" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "bootCapacity" TEXT,
    "dailyRate" DECIMAL(10,2) NOT NULL,
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "location" TEXT,
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "categoryId" TEXT,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Addon" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerRental" DECIMAL(10,2) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Addon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsurancePlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pricePerDay" DECIMAL(10,2) NOT NULL,
    "kmLimit" INTEGER,
    "includesChips" BOOLEAN NOT NULL DEFAULT false,
    "includesCdw" BOOLEAN NOT NULL DEFAULT false,
    "unlimitedKm" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "InsurancePlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "insurancePlanId" TEXT NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3) NOT NULL,
    "pickupAt" TIMESTAMP(3) NOT NULL,
    "returnAt" TIMESTAMP(3) NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "totalQuote" DECIMAL(10,2) NOT NULL,
    "deposit" DECIMAL(10,2) NOT NULL,
    "holdingFee" DECIMAL(10,2) NOT NULL,
    "payFullUpfront" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingDriver" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "licenseNo" TEXT NOT NULL,
    "licenseIssuedAt" TIMESTAMP(3) NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingDriver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingAddon" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "addonId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "BookingAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,
    "kind" "PaymentKind" NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PAID',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkout" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "staffId" TEXT,
    "signedAt" TIMESTAMP(3) NOT NULL,
    "checklist" JSONB NOT NULL,
    "mileageOut" INTEGER NOT NULL,
    "fuelLevel" TEXT NOT NULL,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnProcess" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "staffId" TEXT,
    "returnedAt" TIMESTAMP(3) NOT NULL,
    "mileageIn" INTEGER NOT NULL,
    "fuelLevelIn" TEXT NOT NULL,
    "damageNotes" TEXT,
    "stage" "ReturnStage" NOT NULL DEFAULT 'INSPECTION',
    "lateFee" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "fuelCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "overageCharge" DECIMAL(10,2) NOT NULL DEFAULT 0,

    CONSTRAINT "ReturnProcess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RepairItem" (
    "id" TEXT NOT NULL,
    "returnProcessId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "RepairItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceItem" (
    "id" TEXT NOT NULL,
    "returnProcessId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ServiceItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CleaningItem" (
    "id" TEXT NOT NULL,
    "returnProcessId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "CleaningItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Valuation" (
    "id" TEXT NOT NULL,
    "returnProcessId" TEXT NOT NULL,
    "assessedValue" DECIMAL(10,2) NOT NULL,
    "decision" "ValuationDecision" NOT NULL,
    "remarks" TEXT,

    CONSTRAINT "Valuation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventorySource" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "SourceCategory" NOT NULL,
    "contact" TEXT,

    CONSTRAINT "InventorySource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Procurement" (
    "id" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "itemType" "ItemType" NOT NULL,
    "itemName" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Procurement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VehicleCategory_name_key" ON "VehicleCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_vin_key" ON "Vehicle"("vin");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");

-- CreateIndex
CREATE UNIQUE INDEX "Addon_name_key" ON "Addon"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InsurancePlan_name_key" ON "InsurancePlan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_bookingId_key" ON "Checkout"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnProcess_bookingId_key" ON "ReturnProcess"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Valuation_returnProcessId_key" ON "Valuation"("returnProcessId");

-- CreateIndex
CREATE UNIQUE INDEX "InventorySource_name_key" ON "InventorySource"("name");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "VehicleCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_insurancePlanId_fkey" FOREIGN KEY ("insurancePlanId") REFERENCES "InsurancePlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingDriver" ADD CONSTRAINT "BookingDriver_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingAddon" ADD CONSTRAINT "BookingAddon_addonId_fkey" FOREIGN KEY ("addonId") REFERENCES "Addon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnProcess" ADD CONSTRAINT "ReturnProcess_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnProcess" ADD CONSTRAINT "ReturnProcess_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RepairItem" ADD CONSTRAINT "RepairItem_returnProcessId_fkey" FOREIGN KEY ("returnProcessId") REFERENCES "ReturnProcess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceItem" ADD CONSTRAINT "ServiceItem_returnProcessId_fkey" FOREIGN KEY ("returnProcessId") REFERENCES "ReturnProcess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CleaningItem" ADD CONSTRAINT "CleaningItem_returnProcessId_fkey" FOREIGN KEY ("returnProcessId") REFERENCES "ReturnProcess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Valuation" ADD CONSTRAINT "Valuation_returnProcessId_fkey" FOREIGN KEY ("returnProcessId") REFERENCES "ReturnProcess"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Procurement" ADD CONSTRAINT "Procurement_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "InventorySource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
