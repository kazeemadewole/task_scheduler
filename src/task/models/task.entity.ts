import { BaseEntity } from '../../base/base.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from 'src/user/models/users.entity';

export enum TaskStatus {
  ACTIVE = 'Active',
  Completed = 'Completed',
}
@Entity({ name: 'task' })
export class TaskEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.ACTIVE })
  status: TaskStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
