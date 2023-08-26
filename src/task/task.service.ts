import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from 'src/base/base.service';
import { User } from 'src/user/models/users.entity';
import { Repository } from 'typeorm';
import { TaskEntity, TaskStatus } from './models/task.entity';

@Injectable()
export class TaskService extends BaseService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskEntityRepository: Repository<TaskEntity>,
    @InjectRepository(User)
    private readonly userEntityRepository: Repository<User>,
  ) {
    super();
  }

  public async create(payload: any, userId: string) {
    try {
      const user = await this.userEntityRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        return this.sendFailedResponse({}, 'user does not exist');
      }
      const task = await this.taskEntityRepository.findOne({
        where: { name: payload.name.toLowerCase(), user: { id: userId } },
        relations: {
          user: true,
        },
      });

      if (task) {
        return this.sendFailedResponse(
          {},
          'task with the given name already exist',
        );
      }

      const prepareTask = this.taskEntityRepository.create({
        name: payload.name.toLowerCase(),
        description: payload.description.toLowerCase(),
        status: TaskStatus.ACTIVE,
        user: user,
      });

      const savedTask = await this.taskEntityRepository.save(prepareTask);

      return this.sendSuccessResponse(savedTask, 'task successfully created');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async get(taskId: string, userId: string) {
    try {
      const user = await this.userEntityRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        return this.sendFailedResponse({}, 'user does not exist');
      }

      const task = await this.taskEntityRepository.findOne({
        where: { id: taskId, user: { id: userId } },
        relations: {
          user: true,
        },
      });

      return this.sendSuccessResponse(task, 'task successfully retrieved');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async getAll(userId: string) {
    try {
      const user = await this.userEntityRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        return this.sendFailedResponse({}, 'user does not exist');
      }

      const tasks = await this.taskEntityRepository.find({
        where: { user: { id: userId } },
        relations: {
          user: true,
        },
      });

      return this.sendSuccessResponse(tasks, 'task successfully retrieved');
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async editTask(taskId: string, editOptions: any, userId: string) {
    try {
      try {
        const user = await this.userEntityRepository.findOne({
          where: { id: userId },
        });
        if (!user) {
          return this.sendFailedResponse({}, 'user does not exist');
        }

        const task = await this.taskEntityRepository.findOne({
          where: { id: taskId, user: { id: userId } },
          relations: {
            user: true,
          },
        });

        task.description = editOptions.description.toLowerCase();

        const updatedTask = await this.taskEntityRepository.save(task);

        return this.sendSuccessResponse(
          updatedTask,
          'task successfully updated',
        );
      } catch (error) {
        return Promise.reject(error);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }

  public async deleteTask(taskId: string, userId: string) {
    try {
      const user = await this.userEntityRepository.findOne({
        where: { id: userId },
      });
      if (!user) {
        return this.sendFailedResponse({}, 'user does not exist');
      }

      await this.taskEntityRepository.delete(taskId);
      return this.sendSuccessResponse({}, 'task successfully deleted');
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
