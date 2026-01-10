import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './common/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { RentalModule } from './modules/rental/rental.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { InOutModule } from './modules/inout/inout.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '7d' }
    }),
    AuthModule,
    RentalModule,
    InventoryModule,
    InOutModule
  ]
})
export class AppModule {}
