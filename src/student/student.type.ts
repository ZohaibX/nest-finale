import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentLevel } from './enum/student.level';
import { TaskType } from 'src/task/task.type';

@ObjectType('Student')
export class StudentType {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  status: StudentLevel;

  @Field(type => [TaskType])
  tasks: string[];
}
