import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql';
import { StudentType } from './student.type';
import { StudentService } from './student.service';
import { AuthService } from '../auth/auth.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth-guard/auth.guard';
import { Auth } from 'src/auth/auth.entity';
import { Student } from './student.entity';
import { StudentInput } from './inputs/student.input';
import { StudentLevel } from './enum/student.level';
import { StudentLevelValidationPipe } from './validation-pipe/status-validation.pipe';
import { TaskType } from 'src/task/task.type';

@Resolver(of => StudentType) // its a resolver with return type
export class StudentResolver {
  constructor(
    private studentService: StudentService,
    private authService: AuthService,
  ) {}

  @Query(returns => [StudentType])
  @UseGuards(AuthGuard)
  async getStudents(@Context('user') user: Auth): Promise<Student[]> {
    const studentIds = await this.authService.getAllStudentsAssignedToUser(
      user.id,
    );
    return this.studentService.getStudents(studentIds);
  }

  @Query(returns => StudentType)
  @UseGuards(AuthGuard)
  async getStudent(
    @Args('id') id: string,
    @Context('user') user: Auth,
  ): Promise<Student> {
    const studentIds = await this.authService.getAllStudentsAssignedToUser(
      user.id,
    );
    return this.studentService.getStudent(id, studentIds);
  }

  @Mutation(returns => StudentType)
  @UseGuards(AuthGuard)
  async createStudent(
    @Args('name') name: string,
    @Args('status', StudentLevelValidationPipe) status: StudentLevel,
    @Context('user') user: Auth,
  ): Promise<Student> {
    const { id: userId } = user;
    const data = await this.studentService.createStudent(name, status, userId);
    const studentId = [data.id];
    this.authService.assignStudentsToUser(userId, studentId);
    return data;
  }

  @Mutation(returns => StudentType)
  @UseGuards(AuthGuard)
  async updateStudentLevelStatus(
    @Args('status', StudentLevelValidationPipe) status: StudentLevel,
    @Args('id') id: string,
    @Context('user') user: Auth,
  ): Promise<Student> {
    const studentIds = await this.authService.getAllStudentsAssignedToUser(
      user.id,
    );
    return this.studentService.updateStudentLevelStatus(id, status, studentIds);
  }

  @Mutation(returns => StudentType)
  @UseGuards(AuthGuard)
  async deleteStudent(
    @Args('id') id: string,
    @Context('user') user: Auth,
  ): Promise<{ id: string }> {
    const studentIds = await this.authService.getAllStudentsAssignedToUser(
      user.id,
    );
    const deletedId = await this.studentService.deleteStudent(id, studentIds);
    this.authService.removeDeletedStudentIdFromUser(user.id, deletedId.id);
    return deletedId;
  }
}
