import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength, IsUUID } from 'class-validator';
// GlobarPipe must be provide to main.ts file to use class-validator

@InputType()
export class TaskInput {
  @MinLength(1)
  @Field()
  name: string;
}
