"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const upload_1 = require("../../presentation/controllers/upload");
const services_1 = require("../../application/upload/services");
const interfaces_1 = require("../../core/upload/interfaces");
const infrastructure_module_1 = require("../infrastructure.module");
const interfaces_2 = require("../../shared/interfaces");
const core_1 = require("@nestjs/core");
const filters_1 = require("../https/filters");
const cloudinary_1 = require("../services/cloudinary");
let UploadModule = class UploadModule {
};
exports.UploadModule = UploadModule;
exports.UploadModule = UploadModule = __decorate([
    (0, common_1.Module)({
        imports: [config_1.ConfigModule, infrastructure_module_1.InfrastructureModule],
        controllers: [upload_1.UploadAdminController],
        providers: [
            {
                provide: interfaces_1.STORAGE_PROVIDER,
                useClass: cloudinary_1.CloudinaryStorageProvider,
            },
            {
                provide: services_1.UploadService,
                useFactory: (imageRepository, storageProvider, logger) => {
                    return new services_1.UploadService(imageRepository, storageProvider, logger);
                },
                inject: [interfaces_1.IMAGE_REPOSITORY, interfaces_1.STORAGE_PROVIDER, interfaces_2.LOGGER_SERVICE],
            },
            {
                provide: core_1.APP_FILTER,
                useClass: filters_1.UploadExceptionFilter
            }
        ],
        exports: [services_1.UploadService, interfaces_1.STORAGE_PROVIDER],
    })
], UploadModule);
//# sourceMappingURL=upload.module.js.map