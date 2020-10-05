import { EntityRepository, Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { AuthInput } from './inputs/auth.input';
import * as bcrypt from 'bcryptjs';
import { NotFoundException, UnauthorizedException, Logger } from '@nestjs/common';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@EntityRepository(Auth) // Repository of the entity
export class AuthRepo extends Repository<Auth> {

   private logger = new Logger();

  async signUp(
    authInput: AuthInput,
  ): Promise<{
    id: string;
    username: string;
  }> {
    const { username, password, tasks, students } = authInput;
    this.logger.debug(username)

    const user = this.create();

    (user.id = uuid()), (user.username = username);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    user.tasks = tasks;
    user.students = students;
    try {
      await user.save();
      return {
        id: user.id,
        username: user.username,
      };
    } catch (error) {
      // console.log(error.code); // i can check the error code by make a mistake by creating existing account
      console.log(error.code);
      
      if (error.code === 11000) {
        // if username is duplicate, we will get this error code
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserAccount(
    authInput: AuthInput,
  ): Promise<{
    id: string;
    username: string;
    tasks: string[];
    students: string[];
  }> {
    const { username, password } = authInput;
    this.logger.debug(username)
    const user = await this.findOne({ username: username });

    if (!user) throw new NotFoundException('User not found');

    const validatePassword = await user.validatePassword(password);

    if (!validatePassword)
      throw new UnauthorizedException('Invalid Username or Password')
    
    return {
      id: user.id,
      username: user.username,
      tasks: user.tasks,
      students: user.students,
    };
  }
}
