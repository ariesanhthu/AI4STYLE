import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodBody, ApiZodQuery, Permissions, ZodBody, ZodQuery } from "../shared/decorators";
import { type CreateRoleDto, createRoleSchema, type GetListRoleDto, getListRoleSchema, type UpdateRoleDto, updateRoleSchema } from "./dtos";
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from "../shared/enums";

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.ROLE}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Permissions(EPermission.ROLE_MANAGEMENT)
@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @ApiOperation({ summary: 'Get list of roles with pagination' })
  @ApiZodQuery(getListRoleSchema)
  @Get()
  async getListRoles(@ZodQuery(getListRoleSchema) query: GetListRoleDto) {
    return this.roleService.getListRoles(query);
  }

  @ApiOperation({ summary: 'Get role by ID' })
  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @ApiOperation({ summary: 'Create a new role' })
  @ApiZodBody(createRoleSchema)
  @Post('staff')
  async createRole(@ZodBody(createRoleSchema) body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiZodBody(updateRoleSchema)
  @Patch(':id')
  async updateRole(
    @Param('id') id: string,
    @ZodBody(updateRoleSchema) body: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, body);
  }

  @ApiOperation({ summary: 'Delete a role by ID' })
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}