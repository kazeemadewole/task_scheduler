import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ROLESENUM {
  ADMIN = 'admin',
  USER = 'user',
  SUPER_ADMIN = 'super-admin',
}

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;
  @Column({ nullable: true })
  created_by?: string;
  @CreateDateColumn({ nullable: true })
  created_at?: Date | string;
  @Column({ nullable: true })
  last_modified_by?: string;
  @UpdateDateColumn({ nullable: true })
  updated_at?: Date | string;
}
