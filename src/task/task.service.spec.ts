import { Test } from '@nestjs/testing';
import { TaskService } from './task.service';
import { TaskRepo } from './task.repository';

const mockRepository = () => ({
  getTasks: jest.fn(),
  getTask: jest.fn(),
  createTask: jest.fn(),
  updateTaskStatus: jest.fn(),
  deleteTask: jest.fn(),
  findOne: jest.fn(),
});
// as we are testing service file,
//we have a repository which is injected to service file,
// so we have to create a mock repo

describe('TASKS SERVICES', () => {
  let taskService;
  let taskRepo;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: TaskRepo, useFactory: mockRepository }, // repository injected
        // if we test resolver file, thats how we will inject services files in that
      ],
    }).compile();

    taskService = module.get<TaskService>(TaskService);
    taskRepo = module.get<TaskRepo>(TaskRepo);
  });

  it('GET TASKS', async () => {
    taskRepo.getTasks.mockResolvedValue('something');
    const result = await taskService.getTasks(['test']);
    expect(result).toEqual('something');
  });
});
