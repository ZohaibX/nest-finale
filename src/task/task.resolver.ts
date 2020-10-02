import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskInput } from './inputs/taskInput.input';
import { TaskStatusValidationPipe } from './validation-pipe/status-validation.pipe';
import { TaskStatus } from './enum/status.enum';
import { UseGuards } from '@nestjs/common';
import { Auth } from '../auth/auth.entity';
import { AuthGuard } from '../auth/auth-guard/auth.guard';
import { AuthService } from '../auth/auth.service';

@Resolver(of => TaskType) // its a resolver with return type
export class TaskResolver {
  constructor(
    private taskService: TaskService, 
    private authService: AuthService
    ) {}

  @Query(returns => [TaskType])
  @UseGuards(AuthGuard)
  async getTasks(
    @Context('user') user: Auth
  ): Promise<Task[]> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id)
    return this.taskService.getTasks(taskIds);
  }

  @Query(returns => TaskType)
  @UseGuards(AuthGuard)
  async getTask(
    @Args('id') id: string,
    @Context('user') user: Auth
  ): Promise<Task> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id)
    return this.taskService.getTask(id , taskIds);
  }

  @Mutation(returns => TaskType)
  @UseGuards(AuthGuard)
  async createTask(
    @Args('taskInput') taskInput: TaskInput,
    @Context('user') user: Auth
  ): Promise<Task> {
    // console.log(user);
    // we are sending data back to auth service file , to save this task id within authorized user id 
    const { name } = taskInput;
    const { id: userId } = user;
    const data = await this.taskService.createTask(name); // returns data
    const taskId = [data.id]
    this.authService.assignTasksToUser(userId , taskId)
    return data;
  }

  @Mutation(returns => TaskType)
  @UseGuards(AuthGuard)
  async updateTaskStatus(
    @Args('status', TaskStatusValidationPipe) status: TaskStatus,
    @Args('id') id: string,
    @Context('user') user: Auth
  ): Promise<Task> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id)
    return this.taskService.updateTaskStatus(id, status , taskIds);
  }

  @Mutation(returns => TaskType)
  @UseGuards(AuthGuard)
  async deleteTask(
    @Args('id') id: string, 
    @Context('user') user: Auth
  ): Promise<{ name: string }> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id)
    return this.taskService.deleteTask(id , taskIds);
  }
}
