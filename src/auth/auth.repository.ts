import { EntityRepository, Repository } from 'typeorm';
import { Auth } from './auth.entity';
import { AuthInput } from './inputs/auth.input';
import * as bcrypt from 'bcryptjs';
import { NotFoundException } from '@nestjs/common';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';

@EntityRepository(Auth) // Repository of the entity
export class AuthRepo extends Repository<Auth> {
  async signUp(authInput: AuthInput): Promise<string> {
    const { username, password } = authInput;

    const user = this.create();

    (user.id = uuid()), (user.username = username);
    user.salt = await bcrypt.genSalt();
    user.password = await bcrypt.hash(password, user.salt);
    try {
      await user.save();
      return user.username;
    } catch (error) {
      // console.log(error.code); // i can check the error code by make a mistake by creating existing account
      if (error.code === '23505') {
        // if username is duplicate, we will get this error code
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async validateUserAccount(authInput: AuthInput): Promise<string> {
    const { username, password } = authInput;
    const user = await this.findOne({ username: username });

    if (!user) throw new NotFoundException('User not found');

    const validatePassword = await user.validatePassword(password);

    if (user && validatePassword) return user.username;
    return null;
  }
}
