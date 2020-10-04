import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepo } from './task.repository';
import { Task } from './task.entity';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './enum/status.enum';
import { TaskInput } from './inputs/taskInput.input';
import { AssignInput } from './inputs/assignmentInput.input';

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

  async createTask(taskInput: TaskInput, userId: string): Promise<Task> {
    return this.taskRepo.createTask(taskInput, userId);
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

  async getManyTasks(taskIds: string[]) {
    console.log(taskIds);
    return this.taskRepo.find({
      where: {
        id: {
          $in: taskIds,
        },
      },
    });
  }

  async assignStudentsToTask(assignInput: AssignInput) {
    const { taskId, studentIds } = assignInput;
    const task = await this.taskRepo.findOne({ id: taskId });
    console.log(task);

    task.students = [...task.students, ...studentIds];
    console.log(task);
    return this.taskRepo.save(task);
  }
}
