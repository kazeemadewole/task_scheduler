import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AuthUser } from 'src/auth/decorators/auth-user.decorator';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  private log: Logger = new Logger('prospect controller');

  constructor(private taskService: TaskService) {}

  @Post('/create')
  async createTask(@Body() payload: any, @AuthUser() user) {
    try {
      return this.taskService.create(payload, user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get('/:taskId')
  async getSingleTask(@Param('taskId') taskId: string, @AuthUser() user) {
    try {
      return this.taskService.get(taskId, user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get('/all')
  async getAllTask(@AuthUser() user) {
    try {
      return this.taskService.getAll(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Put('/:taskId')
  async editTask(
    @Param('taskId') taskId: string,
    @Body() payload: any,
    @AuthUser() user,
  ) {
    try {
      return this.taskService.editTask(taskId, payload, user.id);
    } catch (error) {
      throw error;
    }
  }

  @Delete('/:taskId')
  async deleteTask(@Param('taskId') taskId: string, @AuthUser() user) {
    try {
      return this.taskService.deleteTask(taskId, user.id);
    } catch (error) {
      throw error;
    }
  }
}
