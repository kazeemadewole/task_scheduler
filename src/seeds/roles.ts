import { ROLESENUM } from '../base/base.entity';

export const rolesSeed = [
  {
    name: ROLESENUM.SUPER_ADMIN,
    description: 'full system control',
  },
  {
    name: ROLESENUM.ADMIN,
    description: 'an admin',
  },
  {
    name: ROLESENUM.USER,
    description: 'is a user',
  },
];