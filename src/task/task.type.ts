import { Field, ID, ObjectType } from '@nestjs/graphql';
import { TaskStatus } from './enum/status.enum';

//! This file is specific for gql , although similar to entity file

@ObjectType('Task') // so now 'Lesson' will be used as reference . we will not use LessonType(which is a class) for class //! {For Reference only}
export class TaskType {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  status: TaskStatus;

  @Field()
  createdAt: string;
}
