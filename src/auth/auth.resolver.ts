import {
  Resolver,
  Mutation,
  Args,
  Query,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthType } from './auth.type';
import { AuthService } from './auth.service';
import { AuthInput } from './inputs/auth.input';
import { Auth } from './auth.entity';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from './auth-guard/auth.guard';
import { StudentService } from 'src/student/student.service';
import { TaskService } from 'src/task/task.service';

@Resolver(of => AuthType) // its a resolver with return type
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private studentService: StudentService,
    private taskService: TaskService,
  ) {}

  @Mutation(returns => AuthType)
    @UsePipes(ValidationPipe)
  async signUp(
    @Args('authInput') authInput: AuthInput,
  ): Promise<{ signToken: string }> {
    const data = await this.authService.signUp(authInput);
    // console.log(data);
    return data;
  }

  @Mutation(returns => AuthType)
  signIn(
    @Args('authInput') authInput: AuthInput,
  ): Promise<{ signToken: string; tasks: string[]; students: string[] }> {
    return this.authService.signIn(authInput); // we will get only tasks created by user itself , as we are sending auth.students
  }

  @ResolveField()
  @UseGuards(AuthGuard)
  async students(@Parent() auth: Auth, @Context('user') user: Auth) {
    console.log(auth);
    return this.studentService.getManyStudents(auth.students);
  }
  @ResolveField()
  @UseGuards(AuthGuard)
  async tasks(@Parent() auth: Auth, @Context('user') user: Auth) {
    console.log(auth);
    return this.taskService.getManyTasks(auth.tasks); // we will get only tasks created by user itself , as we are sending auth.tasks
  }

  @Query(returns => AuthType)
  @UseGuards(AuthGuard)
  test(@Context('user') user: Auth) {
    this.authService.test(user.username);
    return { signToken: 'test' };
  }
}
