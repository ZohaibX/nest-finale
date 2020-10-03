import { Field, ID, ObjectType } from '@nestjs/graphql';
import { StudentLevel } from './enum/student.level';

@ObjectType('Student')
export class StudentType {
  @Field(type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  status: StudentLevel;
}
