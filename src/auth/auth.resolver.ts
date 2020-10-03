import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { AuthType } from './auth.type';
import { AuthService } from './auth.service';
import { AuthInput } from './inputs/auth.input';
import { Auth } from './auth.entity';
import { UseGuards } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from './auth-guard/auth.guard';

@Resolver(of => AuthType) // its a resolver with return type
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(returns => AuthType)
  signUp(
    @Args('authInput') authInput: AuthInput,
  ): Promise<{ signToken: string }> {
    return this.authService.signUp(authInput);
  }

  @Mutation(returns => AuthType)
  signIn(
    @Args('authInput') authInput: AuthInput,
  ): Promise<{ signToken: string }> {
    return this.authService.signIn(authInput);
  }

  @Query(returns => AuthType)
  @UseGuards(AuthGuard)
  test(@Context('user') user: Auth) {
    this.authService.test(user.username);
    return { signToken: 'test' };
  }
}
