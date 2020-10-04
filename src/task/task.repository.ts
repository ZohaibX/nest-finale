import { EntityRepository, Repository } from 'typeorm';
import { Task } from './task.entity';
import { v4 as uuid } from 'uuid';
import { TaskStatus } from './enum/status.enum';
import { NotFoundException } from '@nestjs/common';
import { TaskInput } from './inputs/taskInput.input';

@EntityRepository(Task)
export class TaskRepo extends Repository<Task> {
  async getTasks(taskIds: string[]): Promise<Task[]> {
    return this.find({
      where: {
        id: {
          $in: taskIds,
        },
      },
    });
  }

  async getTask(id: string, taskIds: string[]): Promise<Task> {
    // if provided task is created by user itself, then user will have that task id in its tasks property
    const userCreatedTaskId = taskIds.find(idx => idx === id);
    // console.log(userCreatedTaskId);
    if (!userCreatedTaskId) throw new NotFoundException('Task Not Found');
    return this.findOne({ id: userCreatedTaskId });
  }

  async createTask(taskInput: TaskInput, userId: string): Promise<Task> {
    const { name, students } = taskInput;
    const task = this.create({
      id: uuid(),
      name,
      status: TaskStatus.DONE,
      createdAt: new Date().toISOString(),
      userId,
      students,
    });

    return this.save(task);
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    taskIds: string[],
  ): Promise<Task> {
    // if provided task is created by user itself, then user will have that task id in its tasks property
    const userCreatedTaskId = taskIds.find(idx => idx === id);

    if (!userCreatedTaskId)
      throw new NotFoundException('Task Not Found To Update');

    const task = await this.findOne({ id }); // as id is verified to be from user's created one
    // i could use this id as it is or i could say id:userCreatedTaskId
    task.status = status;

    return this.save(task);
  }

  async deleteTask(id: string, taskIds: string[]): Promise<{ id: string }> {
    // if provided task is created by user itself, then user will have that task id in its tasks property
    const userCreatedTaskId = taskIds.find(idx => idx === id);

    if (!userCreatedTaskId)
      throw new NotFoundException('Task Not Found To Delete');

    const task = await this.findOne({ id });
    const data = await this.delete({ id });
    if (!data) throw new NotFoundException('Data Not Found');

    // we are returning just name:"deleted", so we can retrieve name property from graphql and findout if it is deleted or not
    return {
      id: task.id,
    };
  }
}
