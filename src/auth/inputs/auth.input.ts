import { InputType, Field, ID  } from '@nestjs/graphql';
import { MinLength, Matches, IsNumber, Contains, Length } from 'class-validator';
// GlobalPipe must be provide to main.ts file to use class-validator

@InputType()
export class AuthInput {
  @Field(type => String)
  @Length(5, 20)
  username: string;
  
  @Field()
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password is too weak',
  })
  password: string;

  @Field(() => [ID], { defaultValue: [] })
  tasks: string[];

  @Field(() => [ID], { defaultValue: [] })
  students: string[];
}
