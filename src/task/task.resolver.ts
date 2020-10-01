import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TaskType } from './task.type';
import { TaskService } from './task.service';
import { Task } from './task.entity';
import { TaskInput } from './inputs/taskInput.input';
import { TaskStatusValidationPipe } from './validation-pipe/status-validation.pipe';
import { TaskStatus } from './enum/status.enum';

@Resolver(of => TaskType) // its a resolver with return type
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(returns => [TaskType])
  getTasks(): Promise<Task[]> {
    return this.taskService.getTasks();
  }

  @Query(returns => TaskType)
  getTask(@Args('id') id: string): Promise<Task> {
    return this.taskService.getTask(id);
  }

  @Mutation(returns => TaskType)
  createTask(@Args('taskInput') taskInput: TaskInput): Promise<Task> {
    const { name } = taskInput;
    return this.taskService.createTask(name);
  }

  @Mutation(returns => TaskType)
  updateTaskStatus(
    @Args('status', TaskStatusValidationPipe) status: TaskStatus,
    @Args('id') id: string,
  ): Promise<Task> {
    return this.taskService.updateTaskStatus(id, status);
  }

  @Mutation(returns => TaskType)
  deleteTask(@Args('id') id: string): Promise<{ name: string }> {
    return this.taskService.deleteTask(id);
  }
}
