import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UNIT_OF_WORK } from '@/application/shared';
import { PrismaUnitOfWork } from './unit-of-work/prisma-unit-of-work';

@Global() // Makes PrismaService available everywhere
@Module({
  providers: [
    PrismaService, 
    {
      provide: UNIT_OF_WORK,
      useClass: PrismaUnitOfWork,
    }
  ],
  exports: [PrismaService, UNIT_OF_WORK],
})
export class PrismaModule {}
