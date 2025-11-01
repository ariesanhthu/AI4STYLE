import { Body, Controller, Delete, Get, Patch, Post, Query } from "@nestjs/common";
import { RoleService } from "./role.service";
import { PaginationCursorQueryDto } from "../shared/dtos";
import { CreateRoleDto, UpdateRoleDto } from "./dtos";
import { ApiBearerAuth, ApiOperation, ApiSecurity, ApiTags } from "@nestjs/swagger";
import { Public } from "../shared/decorators";

@ApiTags('Roles')
@ApiBearerAuth()
@ApiSecurity('x-api-key')
@Public()
@Controller('role')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
  ) {}

  @Get()
  async getListRoles(@Query() query: PaginationCursorQueryDto) {
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

  @Post()
  async createRole(@Body() body: CreateRoleDto) {
    return this.roleService.createRole(body);
  }

  @Patch(':id')
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