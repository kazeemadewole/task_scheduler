import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLESENUM } from '../base/base.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto';
import { Role } from './model/roles.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  async createRole(createRole: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create({
      ...createRole,
      name: createRole.name as unknown as ROLESENUM,
    });

    return this.roleRepository.save(role);
  }

  async getAllRole(): Promise<Role[]> {
    return this.roleRepository.find();
  }

  async getRoleByName(role: ROLESENUM): Promise<Role> {
    role = role.toLowerCase() as unknown as ROLESENUM;
    return this.roleRepository.findOne({ where: { name: role } });
  }

  public isHigherRole(role: ROLESENUM): boolean {
    if (
      Object.values(ROLESENUM)
        .filter((item) => item !== ROLESENUM.USER)
        .includes(role)
    ) {
      return true;
    }

    return false;
  }
}
