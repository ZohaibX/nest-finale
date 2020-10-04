import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength, IsUUID } from 'class-validator';
// GlobarPipe must be provide to main.ts file to use class-validator

@InputType()
export class AssignTasksToStudentInput {
  @IsUUID()
  @Field(type => ID)
  studentId: string;

  @IsUUID('4', { each: true }) // UUID v4 and means array
  @Field(type => [ID])
  taskIds: string[];
}
