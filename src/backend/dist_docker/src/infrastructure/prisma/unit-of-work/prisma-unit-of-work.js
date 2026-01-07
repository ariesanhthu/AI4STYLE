"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUnitOfWork = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
const prisma_unit_of_work_session_1 = require("./prisma-unit-of-work-session");
let PrismaUnitOfWork = class PrismaUnitOfWork {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async start() {
        let resolveSession;
        const sessionPromise = new Promise((resolve) => {
            resolveSession = resolve;
        });
        let resolveTx;
        let rejectTx;
        const txPromise = new Promise((resolve, reject) => {
            resolveTx = resolve;
            rejectTx = reject;
        });
        this.prisma
            .$transaction(async (tx) => {
            const session = new prisma_unit_of_work_session_1.PrismaUnitOfWorkSession(tx, async () => {
                resolveTx();
            }, async () => {
                rejectTx(new Error('Rollback'));
            });
            resolveSession(session);
            try {
                await txPromise;
            }
            catch (err) {
                throw err;
            }
        }, { timeout: 20000, maxWait: 5000 })
            .catch((err) => {
            if (err.message !== 'Rollback') {
            }
        });
        return sessionPromise;
    }
};
exports.PrismaUnitOfWork = PrismaUnitOfWork;
exports.PrismaUnitOfWork = PrismaUnitOfWork = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaUnitOfWork);
//# sourceMappingURL=prisma-unit-of-work.js.map