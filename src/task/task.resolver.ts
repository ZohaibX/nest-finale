import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
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
import { Student } from '../student/student.entity';
import { StudentService } from '../student/student.service';
import { AssignInput } from './inputs/assignmentInput.input';

@Resolver(of => TaskType) // its a resolver with return type
export class TaskResolver {
  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private studentService: StudentService,
  ) {}

  @Query(returns => [TaskType])
  @UseGuards(AuthGuard)
  async getTasks(@Context('user') user: Auth): Promise<Task[]> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id);
    return this.taskService.getTasks(taskIds);
  }

  @Query(returns => TaskType)
  @UseGuards(AuthGuard)
  async getTask(
    @Args('id') id: string,
    @Context('user') user: Auth,
  ): Promise<Task> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id);
    return this.taskService.getTask(id, taskIds);
  }

  @Mutation(returns => TaskType)
  @UseGuards(AuthGuard)
  async createTask(
    @Args('taskInput') taskInput: TaskInput,
    @Context('user') user: Auth,
  ): Promise<Task> {
    // console.log(user);
    // we are sending data back to auth service file , to save this task id within authorized user id
    const { id: userId } = user;
    const data = await this.taskService.createTask(taskInput, userId); // returns data
    const taskId = [data.id];
    this.authService.assignTasksToUser(userId, taskId);
    return data;
  }

  @Mutation(returns => TaskType)
  @UseGuards(AuthGuard)
  async updateTaskStatus(
    @Args('status', TaskStatusValidationPipe) status: TaskStatus,
    @Args('id') id: string,
    @Context('user') user: Auth,
  ): Promise<Task> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id);
    return this.taskService.updateTaskStatus(id, status, taskIds);
  }

  @Mutation(returns => TaskType)
  @UseGuards(AuthGuard)
  async deleteTask(
    @Args('id') id: string,
    @Context('user') user: Auth,
  ): Promise<{ id: string }> {
    const taskIds = await this.authService.getAllTasksAssignedToUser(user.id);
    const deletedId = await this.taskService.deleteTask(id, taskIds);
    this.authService.removeDeletedIdFromUser(user.id, deletedId.id);
    return deletedId;
  }

  @Mutation(returns => TaskType)
  async assignStudentsToTask(@Args('assignInput') assignInput: AssignInput) {
    console.log(assignInput);
    return this.taskService.assignStudentsToTask(assignInput);
  }
  @ResolveField()
  async students(@Parent() task: Task) {
    return this.studentService.getManyStudents(task.students);
  }
}
