import { Test } from '@nestjs/testing';
import { AuthRepo } from '../auth.repository';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Auth } from '../auth.entity';
// as we inject repository file in service file
// we will set a mock repository file
const mockRepo = () => ({
  signUp: jest.fn(),
  validateUserAccount: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const mockJwtService = {
  sign: jest.fn(),
};

const authInput = {
  username: 'test',
  password: 'test',
  tasks: [],
  students: [],
};

describe('AUTH SERVICES', () => {
  let authService;
  let authRepo;
  let jwtService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService, // actual module
        // dependenciess
        { provide: AuthRepo, useFactory: mockRepo },
        { provide: JwtService, useValue: mockJwtService }, // Look at this 2nd service
        //! we could use useValue for other things we wanna add in a module
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authRepo = module.get<AuthRepo>(AuthRepo);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('SIGNUP', () => {
    it('returns sign token', async () => {
      authRepo.signUp.mockResolvedValue({ id: 'test', username: 'test' });
      jwtService.sign.mockReturnValue('sometoken'); // it isn't async, so simply returned
      const result = await authService.signUp(authInput);
      expect(result).toEqual({ signToken: 'sometoken' });
    });
  });

  describe('SIGN_IN', () => {
    it('it returns { signToken, tasks, students }', async () => {
      authRepo.validateUserAccount.mockResolvedValue(authInput); // thats what i wanna return
      jwtService.sign.mockReturnValue('sometoken');  // it isn't async, so simply returned

      const result = await authService.signIn(authInput);
      expect(result).toEqual({
        signToken: 'sometoken',
        tasks: [],
        students: [],
      });
    });

    it('throw new UnauthorizedException as user is not found', async () => {
      authRepo.validateUserAccount.mockResolvedValue({
        user: null,
      });
      await expect(authService.signIn(authInput)).rejects.toThrow(
        new UnauthorizedException('Invalid Credentials'),
      );
    });
  });

  describe('ASSIGN TASK', () => {
    it('returns user.tasks', async () => {
      const user = new Auth();
      user.tasks = [];

      authRepo.findOne.mockResolvedValue(user);
      // after finding the user, it will add the task id into it
      authRepo.save.mockResolvedValue(user);

      const result = await authService.assignTasksToUser('testStudent', ['1']);
      // 1st studentId argument will be ignored because we have already resolved findOne method.
      // and 2nd argument will be processed to add the id array

      expect(result).toEqual({ tasks: ['1'] });
    });
  });

  describe('REMOVE IT', () => {
    it('removeDeletedIdFromUser', async () => {
      const user = new Auth();
      user.tasks = ['1'];

      authRepo.findOne.mockResolvedValue(user);
      // it will find the user and then will delete the ID i send in parameter
      authRepo.save.mockResolvedValue(user);

      const result = await authService.removeDeletedIdFromUser(
        'testStudent',
        '1',
      );
      // 1st studentId argument will be ignored because we have already resolved findOne method.
      // and 2nd argument will be processed to remove the id
      expect(result).toEqual({ tasks: [] });
    });
  });

  describe('GET ALL TASKS ASSIGNED', () => {
    it('getAllTasksAssignedToUser', async () => {
      const user = new Auth();
      user.tasks = ['1', '2'];
      authRepo.findOne.mockResolvedValue(user);
      const result = await authService.getAllTasksAssignedToUser('1');
      expect(result).toEqual(['1', '2']);
    });
  });

  //! NEXT THREE TESTS ARE SAME AS PREVIOUS 3
});
