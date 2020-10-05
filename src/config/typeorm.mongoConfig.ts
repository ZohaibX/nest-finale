import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { Task } from './../task/task.entity';
import { Auth } from './../auth/auth.entity';
import { Student } from '../student/student.entity';

const myConfig: {
  type: 'mongodb';
  url: string;
  synchronize: boolean;
} = config.get('db');

//! all the process.env Variables we will apply when we will deploy it in elasticbeanstalk
//! Everything is in deployment section of nest js course .

export const typeOrmMongoConfig: TypeOrmModuleOptions = {
  type: myConfig.type,
  url: process.env.URL || myConfig.url,
  synchronize: myConfig.synchronize, // false in production
  useUnifiedTopology: true,
  // we'll define all the entities here
  entities: [Task, Auth, Student],
};
