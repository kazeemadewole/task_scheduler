import { SetMetadata } from '@nestjs/common';
import { ROLESENUM } from '../../base/base.entity';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: ROLESENUM[]) => SetMetadata(ROLES_KEY, roles);
