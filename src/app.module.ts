import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TaskModule } from './task/task.module';
import { Task } from './task/task.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmMongoConfig } from './config/typeorm.mongoConfig';
import { AuthModule } from './auth/auth.module';
import { StudentModule } from './student/student.module';
import * as passport from 'passport';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmMongoConfig),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({ headers: req.headers }),
    }),
    TaskModule,
    AuthModule,
    StudentModule,
  ],
})
export class AppModule {}
