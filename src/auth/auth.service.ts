import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepo } from './auth.repository';
import { AuthInput } from './inputs/auth.input';
import { Auth } from './auth.entity';
import { JwtPayload } from './jwt-payload/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepo)
    private authRepo: AuthRepo,
    private jwtService: JwtService,
  ) {}

  private logger = new Logger();

  async signUp(authInput: AuthInput): Promise<{ signToken: string }> {
    const { id, username } = await this.authRepo.signUp(authInput);

    const payload: JwtPayload = { id, username }; // JwtPayload is an interface class defined in other file
    const signToken = this.jwtService.sign(payload); // signing with payload

    this.logger.debug(
      `Token signed with the payload ${JSON.stringify(payload)} `,
    );
    return { signToken };
  }

  async signIn(
    authInput: AuthInput,
  ): Promise<{ signToken: string; tasks: string[]; students: string[] }> {
    const {
      id,
      username,
      tasks,
      students,
    } = await this.authRepo.validateUserAccount(authInput);

    if (!username) throw new UnauthorizedException('Invalid Credentials'); // if null, throw UnauthorizedException

    // signing token
    const payload: JwtPayload = { id, username }; // JwtPayload is an interface class defined in other file
    const signToken = this.jwtService.sign(payload); // signing with payload

    this.logger.debug(
      `Token signed with the payload ${JSON.stringify(payload)} `,
    );

    return { signToken, tasks, students };
  }

  async test(username: string) {
    const data = await this.authRepo.findOne({ username });
  }

  async assignTasksToUser(userId: string, taskIds: string[]) {
    const user = await this.authRepo.findOne({ id: userId });
    user.tasks = [...user.tasks, ...taskIds];
    return this.authRepo.save(user);
  }
  async removeDeletedIdFromUser(userId: string, taskId: string) {
    const user = await this.authRepo.findOne({ id: userId });
    const index = user.tasks.indexOf(taskId);
    user.tasks.splice(index, 1);
    return this.authRepo.save(user);
  }
  async getAllTasksAssignedToUser(userId: string): Promise<string[]> {
    const user = await this.authRepo.findOne({ id: userId });
    return user.tasks;
  }

  async assignStudentsToUser(userId: string, studentIds: string[]) {
    const user = await this.authRepo.findOne({ id: userId });
    user.students = [...user.students, ...studentIds];
    return this.authRepo.save(user);
  }
  async removeDeletedStudentIdFromUser(userId: string, studentId: string) {
    const user = await this.authRepo.findOne({ id: userId });
    const index = user.tasks.indexOf(studentId);
    user.students.splice(index, 1);
    return this.authRepo.save(user);
  }
  async getAllStudentsAssignedToUser(userId: string): Promise<string[]> {
    const user = await this.authRepo.findOne({ id: userId });
    return user.students;
  }
}
