import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskType } from 'src/task/task.type';
import { StudentType } from '../student/student.type';

@ObjectType('Auth')
export class AuthType {
  @Field()
  signToken: string;

  @Field(type => [TaskType])
  tasks: string[];

  @Field(type => [StudentType])
  students: string[];
}
