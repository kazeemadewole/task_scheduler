import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './models/task.entity';
import { User } from 'src/user/models/users.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, User])],
  providers: [TaskService],
  controllers: [TaskController],
})
export class TaskModule {}
