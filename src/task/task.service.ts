import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepo } from './task.repository';
import { Task } from './task.entity';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './enum/status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(TaskRepo)
    private taskRepo: TaskRepo,
  ) {}

  async getTasks(taskIds: string[]): Promise<Task[]> {
    return this.taskRepo.getTasks(taskIds);
  }

  async getTask(id: string, taskIds: string[]): Promise<Task> {
    return this.taskRepo.getTask(id, taskIds);
  }

  async createTask(name: string, userId: string): Promise<Task> {
    return this.taskRepo.createTask(name, userId);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    taskIds: string[],
  ): Promise<Task> {
    return this.taskRepo.updateTaskStatus(id, status, taskIds);
  }

  async deleteTask(id: string, taskIds: string[]): Promise<{ id: string }> {
    return this.taskRepo.deleteTask(id, taskIds);
  }
}
