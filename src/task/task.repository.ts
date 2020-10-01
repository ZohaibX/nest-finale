import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './enum/status.enum';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepo extends Repository<Task> {
  async getTasks(): Promise<Task[]> {
    return this.find();
  }

  async getTask(id: string): Promise<Task> {
    return this.findOne({ id });
  }

  async createTask(name: string): Promise<Task> {
    const task = this.create({
      id: uuid(),
      name,
      status: TaskStatus.DONE,
      createdAt: new Date().toISOString(),
    });

    return this.save(task);
  }

  async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
    const task = await this.findOne({ id });
    task.status = status;

    return this.save(task);
  }

  async deleteTask(id: string): Promise<{ name: string }> {
    const data = await this.delete({ id });
    console.log(data);
    if (!data) throw new NotFoundException('Data Not Found');

    // we are returning just name:"deleted", so we can retrieve name property from graphql and findout if it is deleted or not
    return {
      name: 'Deleted',
    };
  }
}
