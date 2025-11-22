import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import {
  ROLE_REPOSITORY,
  type IRoleRepository,
} from '../core/role/interfaces/role.repository.interface';
import { EPermission, ESortOrder, EUserType } from '../shared/enums';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from '../core/user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { type IUserRepository, USER_REPOSITORY } from '@/core/user/interfaces';
import { RoleEntity } from '@/core/role/entities';

@Injectable()
export class InitializationService implements OnModuleInit {
  private readonly logger = new Logger(InitializationService.name);
  constructor(
    @Inject(ROLE_REPOSITORY) private readonly roleRepository: IRoleRepository,
    @Inject(USER_REPOSITORY) private readonly userRepository: IUserRepository,
    private readonly configService: ConfigService,
  ) {}

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
      sortOrder: ESortOrder.DESC,
    });
    if (entities) {
      entities.forEach((entity) => {
        if (entity.type === EUserType.ADMIN) {
          flagExistAdmin = true;
        }
        if (entity.type === EUserType.GUEST) {
          flagExistGuest = true;
        }
        if (entity.type === EUserType.STAFF) {
          flagExistStaff = true;
        }
      });
    }

    if (!flagExistAdmin) {
      await this.roleRepository.create(
        new RoleEntity(
          randomUUID(),
          'ADMIN',
          'Administrator with full access',
          EUserType.ADMIN,
          Array.from(Object.values(EPermission)),
          new Date(),
          new Date(),
        ),
      );
    }

    if (!flagExistStaff) {
      await this.roleRepository.create(
        new RoleEntity(
          randomUUID(),
          'General STAFF',
          'Staff with general access',
          EUserType.STAFF,
          [
            EPermission.CATEGORY_MANAGEMENT,
            EPermission.DASHBOARD_ACCESS,
            EPermission.ORDER_MANAGEMENT,
            EPermission.PRODUCT_MANAGEMENT,
          ],
          new Date(),
          new Date(),
        ),
      );
    }

    if (!flagExistGuest) {
      await this.roleRepository.create(
        new RoleEntity(
          randomUUID(),
          'General GUEST',
          'Guest with general access',
          EUserType.GUEST,
          [],
          new Date(),
          new Date(),
        ),
      );
    }
    this.logger.log('Role initialized successfully');
  }

  async initializeAdmin() {
    const ADMIN_EMAIL = this.configService.get<string>('ADMIN_EMAIL') || '';
    const ADMIN_PASSWORD =
      this.configService.get<string>('ADMIN_PASSWORD') || '';
    const entity = await this.userRepository.findByEmail(ADMIN_EMAIL);

    if (entity) {
      return;
    }

    const adminRole = await this.roleRepository.findByType(EUserType.ADMIN);
    if (!adminRole) {
      throw new Error('Does not have default Admin role');
    }

    const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

    const newUser = new UserEntity(
      randomUUID(),
      ADMIN_EMAIL,
      '',
      hashedPassword,
      'Shop owner',
      '',
      new Date(),
      '',
      new Date(),
      new Date(),
      adminRole?.id,
    );
    await this.userRepository.create(newUser);
  }
}
