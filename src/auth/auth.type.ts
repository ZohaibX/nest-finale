import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Auth')
export class AuthType {
  @Field()
  signToken: string;
}
