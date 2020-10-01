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

  async getTasks(): Promise<Task[]> {
    return this.taskRepo.getTasks();
  }

  async getTask(id: string): Promise<Task> {
    return this.taskRepo.getTask(id);
  }

  async createTask(name: string): Promise<Task> {
    return this.taskRepo.createTask(name);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    return this.taskRepo.updateTaskStatus(id, status);
  }

  async deleteTask(id: string): Promise<{ name: string }> {
    return this.taskRepo.deleteTask(id);
  }
}
