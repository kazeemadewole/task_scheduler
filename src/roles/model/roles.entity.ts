import { ROLESENUM } from '../../base/base.entity';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ROLESENUM, default: ROLESENUM.USER })
  name: ROLESENUM;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: string;

  @UpdateDateColumn()
  updated_at: string;

  @BeforeInsert()
  roleNameLowerCase() {
    this.name = this.name.toLowerCase() as unknown as ROLESENUM;
  }
}
