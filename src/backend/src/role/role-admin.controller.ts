import { Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { RoleService } from "./role.service";
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodBody, ApiZodErrorResponse, ApiZodQuery, ApiZodResponse, Permissions, ZodBody, ZodQuery } from "../shared/decorators";
import { type CreateRoleDto, createRoleSchema, type GetListRoleDto, getListRoleSchema, type UpdateRoleDto, updateRoleSchema } from "./dtos";
import { EPermission, ESwaggerTag, ESwaggerTagPrefix } from "../shared/enums";
import { createPaginationCursorResponseSchema, errorResponseSchema, statusResponseSchema } from "../shared/dtos";
import { roleResponse } from "./dtos/role-response.dto";

@ApiTags(`${ESwaggerTagPrefix.ADMIN}-${ESwaggerTag.ROLE}`)
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@ApiZodErrorResponse(errorResponseSchema)
@Permissions(EPermission.ROLE_MANAGEMENT)
@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @ApiZodResponse({ status: 200, description: 'List of roles retrieved successfully', schema: createPaginationCursorResponseSchema(roleResponse) })
  @ApiOperation({ summary: 'Get list of roles with pagination' })
  @ApiZodQuery(getListRoleSchema)
  @Get()
  async getListRoles(@ZodQuery(getListRoleSchema) query: GetListRoleDto) {
    return this.roleService.getListRoles(query);
  }

  @ApiZodResponse({ status: 200, description: 'Role retrieved successfully', schema: roleResponse })
  @ApiOperation({ summary: 'Get role by ID' })
  @Get(':id')
  async getRoleById(@Param('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @ApiZodResponse({ status: 201, description: 'Role created successfully', schema: roleResponse })
  @ApiOperation({ summary: 'Create a new role' })
  @ApiZodBody(createRoleSchema)
  @Post('staff')
  async createRole(@ZodBody(createRoleSchema) body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @ApiZodResponse({ status: 200, description: 'Role updated successfully', schema: roleResponse })
  @ApiOperation({ summary: 'Update a role by ID' })
  @ApiZodBody(updateRoleSchema)
  @Patch(':id')
  async updateRole(
    @Param('id') id: string,
    @ZodBody(updateRoleSchema) body: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, body);
  }

  @ApiZodResponse({ status: 200, description: 'Role deleted successfully', schema: statusResponseSchema })
  @ApiOperation({ summary: 'Delete a role by ID' })
  @Delete(':id')
  async deleteRole(@Param('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}