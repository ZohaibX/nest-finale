import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
// GlobalPipe must be provide to main.ts file to use class-validator

@InputType()
export class AuthInput {
  @MinLength(1)
  @Field()
  username: string;

  @MinLength(1)
  @Field()
  password: string;

  @Field(() => [ID], { defaultValue: [] })
  tasks: string[];
}
