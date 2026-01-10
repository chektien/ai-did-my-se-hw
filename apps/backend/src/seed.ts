import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const staffPassword = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'staff@rcps.dev' },
    update: {},
    create: {
      email: 'staff@rcps.dev',
      passwordHash: staffPassword,
      name: 'RCPS Staff',
      role: UserRole.STAFF
    }
  });


  await prisma.insurancePlan.createMany({
    data: [
      { name: 'Basic', pricePerDay: 10, kmLimit: 100 },
      { name: 'Basic Plus', pricePerDay: 15, kmLimit: 150 },
      { name: 'Essentials', pricePerDay: 20, kmLimit: 120, includesChips: true },
      { name: 'Essential Plus', pricePerDay: 32, kmLimit: 200, includesChips: true, includesCdw: true },
      { name: 'Peace of Mind', pricePerDay: 35, unlimitedKm: true, includesChips: true, includesCdw: true }
    ],
    skipDuplicates: true
  });

  await prisma.addon.createMany({
    data: [
      { name: 'Sat Nav', pricePerRental: 15, stock: 20 },
      { name: 'Child Booster Seat', pricePerRental: 35, stock: 15 },
      { name: 'Fragrance', pricePerRental: 2, stock: 100 },
      { name: 'Umbrella', pricePerRental: 3, stock: 50 }
    ],
    skipDuplicates: true
  });

  const category = await prisma.vehicleCategory.upsert({
    where: { name: 'Compact' },
    update: {},
    create: { name: 'Compact', description: 'Small compact cars', baseDailyRate: 60 }
  });

  await prisma.vehicle.createMany({
    data: [
      {
        plate: 'SBA1234A',
        make: 'Toyota',
        model: 'Corolla',
        year: 2022,
        color: 'Silver',
        seats: 5,
        bootCapacity: 'Medium',
        dailyRate: 70,
        mileage: 15000,
        status: 'AVAILABLE',
        categoryId: category.id
      },
      {
        plate: 'SBC5678B',
        make: 'Honda',
        model: 'Civic',
        year: 2021,
        color: 'Blue',
        seats: 5,
        bootCapacity: 'Medium',
        dailyRate: 75,
        mileage: 18000,
        status: 'AVAILABLE',
        categoryId: category.id
      }
    ],
    skipDuplicates: true
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
