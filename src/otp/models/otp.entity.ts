/* eslint-disable @typescript-eslint/no-unused-vars */
import { OtpStatus, OtpType, OtpUsage } from '../../utils/enums';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../base/base.entity';
import { User } from '../../user/models/users.entity';

/**
 * OTP recording
 */
@Entity('otp')
export class OtpEntity extends BaseEntity {
  @Column({ name: 'otp', nullable: false })
  otp: string;

  @Column({ name: 'type', nullable: false, enum: OtpType })
  type: OtpType;

  @Column({ type: 'uuid' })
  user_id: string;

  @ManyToOne(() => User, (User) => User.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({
    name: 'usage',
    nullable: false,
    enum: OtpUsage,
  })
  usage: OtpUsage;

  @Column({ name: 'expirationTime', nullable: false })
  expirationTime: string;

  @Column({
    name: 'status',
    nullable: false,
    enum: OtpStatus,
    default: OtpStatus.UNUSED,
  })
  status: string;
}
