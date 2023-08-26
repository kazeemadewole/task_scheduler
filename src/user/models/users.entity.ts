import { BaseEntity } from '../../base/base.entity';
import { Role } from '../../roles/model/roles.entity';
import { BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum UserStatus {
  ACTIVE = 'active',
  IN_ACTIVE = 'in-active',
}
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ select: false })
  password: string;

  @Column({ default: false, nullable: true })
  termsAndCondition: boolean;

  @ManyToOne(() => Role)
  @JoinColumn()
  role: Role;

  @Column({ default: false, nullable: true })
  emailVerified: boolean;

  @Column({ default: false, nullable: true })
  phoneVerified: boolean;

  @Column({ type: 'enum', enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @Column({ default: 0 })
  pinAttempt: number;
}
