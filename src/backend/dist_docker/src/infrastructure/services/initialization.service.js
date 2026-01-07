"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var InitializationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitializationService = void 0;
const common_1 = require("@nestjs/common");
const interfaces_1 = require("../../core/role/interfaces");
const enums_1 = require("../../shared/enums");
const crypto_1 = require("crypto");
const config_1 = require("@nestjs/config");
const entities_1 = require("../../core/user/entities");
const bcrypt = __importStar(require("bcrypt"));
const interfaces_2 = require("../../core/user/interfaces");
const entities_2 = require("../../core/role/entities");
const enums_2 = require("../../core/user/enums");
const helpers_1 = require("../../shared/helpers");
let InitializationService = InitializationService_1 = class InitializationService {
    roleRepository;
    userRepository;
    configService;
    logger = new common_1.Logger(InitializationService_1.name);
    constructor(roleRepository, userRepository, configService) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.configService = configService;
    }
    async onModuleInit() {
        await this.initializeRoles();
        await this.initializeAdmin();
    }
    async initializeRoles() {
        this.logger.log('Role initializing ...');
        let flagExistAdmin = false;
        let flagExistGuest = false;
        let flagExistStaff = false;
        const entities = await this.roleRepository.findAll({
            limit: 100,
            cursor: null,
            sortOrder: enums_1.ESortOrder.DESC,
        });
        if (entities) {
            entities.forEach((entity) => {
                if (entity.type === enums_1.EUserType.ADMIN) {
                    flagExistAdmin = true;
                }
                if (entity.type === enums_1.EUserType.GUEST) {
                    flagExistGuest = true;
                }
                if (entity.type === enums_1.EUserType.STAFF) {
                    flagExistStaff = true;
                }
            });
        }
        if (!flagExistAdmin) {
            await this.roleRepository.create(new entities_2.RoleEntity((0, crypto_1.randomUUID)(), 'ADMIN', 'Administrator with full access', enums_1.EUserType.ADMIN, Array.from(Object.values(enums_1.EPermission)), 'admin administrator with full access', new Date(), new Date()));
        }
        if (!flagExistStaff) {
            await this.roleRepository.create(new entities_2.RoleEntity((0, crypto_1.randomUUID)(), 'General STAFF', 'Staff with general access', enums_1.EUserType.STAFF, [
                enums_1.EPermission.CATEGORY_MANAGEMENT,
                enums_1.EPermission.DASHBOARD_ACCESS,
                enums_1.EPermission.ORDER_MANAGEMENT,
                enums_1.EPermission.PRODUCT_MANAGEMENT,
            ], 'general staff staff with general access', new Date(), new Date()));
        }
        if (!flagExistGuest) {
            await this.roleRepository.create(new entities_2.RoleEntity((0, crypto_1.randomUUID)(), 'General GUEST', 'Guest with general access', enums_1.EUserType.GUEST, [], 'guest with general access', new Date(), new Date()));
        }
        this.logger.log('Role initialized successfully');
    }
    async initializeAdmin() {
        const ADMIN_EMAIL = this.configService.get('ADMIN_EMAIL') || '';
        const ADMIN_PASSWORD = this.configService.get('ADMIN_PASSWORD') || '';
        const entity = await this.userRepository.findByEmail(ADMIN_EMAIL);
        if (entity) {
            return;
        }
        const adminRole = await this.roleRepository.findByType(enums_1.EUserType.ADMIN);
        if (!adminRole) {
            throw new Error('Does not have default Admin role');
        }
        const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);
        const newUser = new entities_1.UserEntity((0, crypto_1.randomUUID)(), ADMIN_EMAIL, '', hashedPassword, 'Shop owner', '', enums_2.EGender.MALE, new Date(), '', (0, helpers_1.buildSearchString)('Shop owner', ADMIN_EMAIL, ''), new Date(), new Date(), adminRole?.id);
        await this.userRepository.create(newUser);
    }
};
exports.InitializationService = InitializationService;
exports.InitializationService = InitializationService = InitializationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(interfaces_1.ROLE_REPOSITORY)),
    __param(1, (0, common_1.Inject)(interfaces_2.USER_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, config_1.ConfigService])
], InitializationService);
//# sourceMappingURL=initialization.service.js.map