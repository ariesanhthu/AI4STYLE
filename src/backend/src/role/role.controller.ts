import { Body, Controller, Delete, Get, Patch, Post, Query, UsePipes } from "@nestjs/common";
import { RoleService } from "./role.service";
import { paginationCursorQuerySchema, type PaginationCursorQueryDto } from "../shared/dtos";
import { ApiBearerAuth, ApiBody, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { ApiZodQuery, Public } from "../shared/decorators";
import { ZodValidationPipe } from "../shared/pipes";
import z from "zod";
import { SchemaObject } from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";
import { type CreateRoleDto, createRoleSchema, type UpdateRoleDto, updateRoleSchema } from "./dtos";

@ApiTags('Roles')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Public()
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @ApiZodQuery(paginationCursorQuerySchema)
  @UsePipes(new ZodValidationPipe(paginationCursorQuerySchema))
  @Get()
  @ApiOperation({ summary: 'Get list of roles with pagination' })
  async getListRoles(@Query()  query: PaginationCursorQueryDto) {
    return this.roleService.getListRoles(query);
  }

  @Get(':id')
  async getRoleById(@Query('id') id: string) {
    return this.roleService.getRoleById(id);
  }

  @Get('by-name/:name')
  async getRoleByName(@Query('name') name: string) {
    return this.roleService.getRoleByName(name);
  }

  @ApiBody({ schema: z.toJSONSchema(createRoleSchema) as SchemaObject })
  @Post()
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