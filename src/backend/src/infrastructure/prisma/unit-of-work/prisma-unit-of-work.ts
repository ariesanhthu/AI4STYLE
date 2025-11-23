import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UnitOfWork, UnitOfWorkSession } from '@/application/shared';
import { PrismaUnitOfWorkSession } from './prisma-unit-of-work-session';

@Injectable()
export class PrismaUnitOfWork implements UnitOfWork {
  constructor(private prisma: PrismaService) {}

  async start(): Promise<UnitOfWorkSession> {
    let resolveSession: (session: any) => void;
    let rejectSession: (err: any) => void;

    const sessionPromise = new Promise((resolve, reject) => {
      resolveSession = resolve;
      rejectSession = reject;
    });

    this.prisma.$transaction(
      async (tx: PrismaService) => {
        const session = new PrismaUnitOfWorkSession(
          tx,
          async () => {},
          async () => {
            throw new Error('rollback requested');
          },
        );

        resolveSession(session);

        return await sessionPromise;
      },
      { timeout: 20000 },
    ).catch((e) => {
      rejectSession(e);
    });

    return sessionPromise as any;
  }
}
