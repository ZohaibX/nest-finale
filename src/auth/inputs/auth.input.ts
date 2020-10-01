import { InputType, Field, ID } from '@nestjs/graphql';
import { MinLength } from 'class-validator';
// GlobarPipe must be provide to main.ts file to use class-validator

@InputType()
export class AuthInput {
  @MinLength(1)
  @Field()
  username: string;

  @MinLength(1)
  @Field()
  password: string;
}
