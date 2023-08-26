import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { Roles } from '../auth/decorators/role.decorator';
import { ROLESENUM } from '../base/base.entity';
import { CreateRoleDto } from './dto';
import { Role } from './model/roles.entity';
import { RolesService } from './roles.service';

@Controller('roles')
export class RoleController {
  constructor(private roleService: RolesService) {}

  @Post('')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLESENUM.ADMIN)
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleService.createRole(createRoleDto);
  }

  @Get('')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(ROLESENUM.ADMIN)
  getAllRoles(): Promise<Role[]> {
    return this.roleService.getAllRole();
  }
}
