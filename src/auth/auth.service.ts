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
    const {id , username} = await this.authRepo.signUp(authInput);

    const payload: JwtPayload = { id , username }; // JwtPayload is an interface class defined in other file
    const signToken = this.jwtService.sign(payload); // signing with payload

    this.logger.debug(
      `Token signed with the payload ${JSON.stringify(payload)} `,
    );
    return { signToken };
  }

  async signIn(authInput: AuthInput): Promise<{ signToken: string }> {
    const {id , username} = await this.authRepo.validateUserAccount(authInput);

    if (!username) throw new UnauthorizedException('Invalid Credentials'); // if null, throw UnauthorizedException

    // signing token
    const payload: JwtPayload = { id , username }; // JwtPayload is an interface class defined in other file
    const signToken = this.jwtService.sign(payload); // signing with payload

    this.logger.debug(
      `Token signed with the payload ${JSON.stringify(payload)} `,
    );

    return { signToken };
  }

  async test(username: string) {
    const data = await this.authRepo.findOne({ username });
    console.log(data);
  }

  async assignTasksToUser(userId: string, taskIds: string[]) {
    const user = await this.authRepo.findOne({ id: userId });
    user.tasks = [...user.tasks, ...taskIds];
    return this.authRepo.save(user)
  }

  async getAllTasksAssignedToUser(userId): Promise<string[]> {
    const user = await this.authRepo.findOne({ id: userId });
    return user.tasks;
  }
}
