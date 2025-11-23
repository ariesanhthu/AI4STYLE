import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { IUnitOfWork, IUnitOfWorkSession } from '@/application/shared';
import { PrismaUnitOfWorkSession } from './prisma-unit-of-work-session';

@Injectable()
export class PrismaUnitOfWork implements IUnitOfWork {
  constructor(private prisma: PrismaService) { }

  async start(): Promise<IUnitOfWorkSession> {
    let resolveSession: (session: IUnitOfWorkSession) => void;
    const sessionPromise = new Promise<IUnitOfWorkSession>((resolve) => {
      resolveSession = resolve;
    });

    let resolveTx: () => void;
    let rejectTx: (err: any) => void;
    const txPromise = new Promise<void>((resolve, reject) => {
      resolveTx = resolve;
      rejectTx = reject;
    });

    this.prisma
      .$transaction(
        async (tx) => {
          const session = new PrismaUnitOfWorkSession(
            tx as any,
            async () => {
              resolveTx();
            },
            async () => {
              rejectTx(new Error('Rollback'));
            },
          );

          resolveSession(session);

          try {
            await txPromise;
          } catch (err) {
            throw err;
          }
        },
        { timeout: 20000, maxWait: 5000 },
      )
      .catch((err) => {
        // Ignore rollback error as it is expected
        if (err.message !== 'Rollback') {
          // console.error('Transaction failed', err);
        }
      });

    return sessionPromise;
  }
}
