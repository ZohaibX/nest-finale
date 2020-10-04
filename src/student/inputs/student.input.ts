import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength, IsUUID } from 'class-validator';
import { StudentLevel } from '../enum/student.level';
// GlobalPipe must be provide to main.ts file to use class-validator

@InputType()
export class StudentInput {
  @MinLength(1)
  @Field()
  name: string;

  @Field(() => [ID], { defaultValue: [] })
  tasks: string[];
}
