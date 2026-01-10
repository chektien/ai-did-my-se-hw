import { Module } from '@nestjs/common';
import { InOutController } from './inout.controller';
import { InOutService } from './inout.service';

@Module({
  controllers: [InOutController],
  providers: [InOutService]
})
export class InOutModule {}
