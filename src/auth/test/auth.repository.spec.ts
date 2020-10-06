import * as bcrypt from 'bcryptjs';
import { Test } from '@nestjs/testing';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { AuthRepo } from './../auth.repository';
import { Auth } from '../auth.entity';   

describe('AUTH REPOSITORY', () => {
  let authRepoTestModule;
  const authInput = {
    username: 'test',
    password: 'test',
    tasks: ['test'],
    students: ['test'],
  };

  beforeEach(async () => {
    // creating testing module for AuthRepo
    const module = await Test.createTestingModule({
      providers: [AuthRepo],
    }).compile();

    authRepoTestModule = module.get<AuthRepo>(AuthRepo);
  });

  //! We only want to test what is returned, save function

  describe('SIGN_UP', () => {
    let save;

    beforeEach(() => {
      save = jest.fn();

      //! this is how we use create method, we don't need to create every property of a user
      //! we just need to get the return value, which is a save function
      authRepoTestModule.create = jest.fn().mockReturnValue({ save: save });
    });

    it('THROW NO ERROR IF SIGN_UP RETURNS UNDEFINED', async () => {
      save.mockResolvedValue(undefined);
      // if signUp returns undefined, of course it is wrong, it will not run fine but we don't throw an error at least
      expect(authRepoTestModule.signUp(authInput)).resolves.not.toThrow();
    });

    it('THROWS A CONFLICT ERROR', async () => {
      save.mockRejectedValue({ code: 11000 }); //! Look at this, rejectedValue
      // as we rejected the save function
      // it will go to catch block .

      await expect(authRepoTestModule.signUp(authInput)).rejects.toThrow(
        ConflictException,
      );
    });

    it('THROWS AN INTERNAL SERVER ERROR', async () => {
      save.mockRejectedValue({ code: 12000 }); //! Look at this, rejectedValue
      // as we rejected the save function
      // it will go to catch block .
      await expect(authRepoTestModule.signUp(authInput)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('VALIDATION ACCOUNT', () => {
    let user;

    beforeEach(() => {
      authRepoTestModule.findOne = jest.fn();

      user = new Auth();
      user.password = 'testpassword';
      user.salt = 'testpassword';
      user.validatePassword = jest.fn();
      user.tasks = ['test'];
      user.students = ['test'];
    });

    it('returns a username as password is truesy', async () => {
      authRepoTestModule.findOne.mockResolvedValue(user); // it returns a user
      user.validatePassword.mockResolvedValue(true);

      const result = await authRepoTestModule.validateUserAccount(authInput);
      expect(result).toEqual({
        id: user.id,
        username: user.username,
        tasks: user.tasks,
        students: user.students,
      });
    });

    //! The error is not thrown by try catch
    //! so we had to use mockResolvedValue with findOne method
    //! and in expect method, we have to write full statement containing message
    it('throws NotFoundException as user not found', async () => {
      authRepoTestModule.findOne.mockResolvedValue(null); // it returns a user
      user.validatePassword.mockResolvedValue(true);

      // const data = await authRepoTestModule.validateUserAccount(authInput);
      await expect(
        authRepoTestModule.validateUserAccount(authInput),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });

    it('throws UnauthorizedException as password is invalid', async () => {
      authRepoTestModule.findOne.mockResolvedValue(user); // it returns a user
      user.validatePassword.mockResolvedValue(false);

      await expect(
        authRepoTestModule.validateUserAccount(authInput),
      ).rejects.toThrow(
        new UnauthorizedException('Invalid Username or Password'),
      );
    });

    describe('PASSWORD HASHING', () => {
      it('BCRYPT WORKS', async () => {
        bcrypt.hash = jest.fn().mockResolvedValue('somehash');
        const data = await bcrypt.hash('somepassword', 'somesalt');
        expect(data).toEqual('somehash');
      });
    });
  });
});
