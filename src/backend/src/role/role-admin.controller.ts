import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { RoleService } from "./role.service";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodQuery, Permissions } from "../shared/decorators";
import { ZodValidationPipe } from "../shared/pipes";
import z from "zod";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
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

  @ApiZodQuery(getListRoleSchema)
  @UsePipes(new ZodValidationPipe(getListRoleSchema))
  @Get()
  @ApiOperation({ summary: 'Get list of roles with pagination' })
  async getListRoles(@Query()  query: GetListRoleDto) {
    return this.roleService.getListRoles(query);
  }

  @Get(':id')
  async getRoleById(@Query('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @ApiBody({ schema: z.toJSONSchema(createRoleSchema) as SchemaObject })
  @Post('staff')
  @UsePipes(new ZodValidationPipe(createRoleSchema))
  async createRole(@Body() body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @ApiBody({ schema: z.toJSONSchema(updateRoleSchema) as SchemaObject })
  @Patch(':id')
  @UsePipes(new ZodValidationPipe(updateRoleSchema))
  async updateRole(
    @Query('id') id: string,
    @Body() body: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(id, body);
  }

  @Delete(':id')
  async deleteRole(@Query('id') id: string) {
    return this.roleService.deleteRole(id);
  }
}