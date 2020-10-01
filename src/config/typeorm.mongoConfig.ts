import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { Task } from './../task/task.entity';
import { Auth } from './../auth/auth.entity';

// all the process.env.RDS Variables will be saved in Elasticbeanstalk
export const typeOrmMongoConfig: TypeOrmModuleOptions = {
  type: 'mongodb',
  url:
    'mongodb+srv://zohaib:1234@cluster0-vvrwq.mongodb.net/test-1?retryWrites=true&w=majority',
  synchronize: true,
  useUnifiedTopology: true,
  // we'll define all the entities here
  entities: [Task, Auth],
};
