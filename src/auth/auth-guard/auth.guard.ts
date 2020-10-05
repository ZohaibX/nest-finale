import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';
import { UnauthorizedException } from '@nestjs/common';
import * as config from 'config';

const myConfig: { secretkey: string } = config.get('jwt');

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    if (!ctx.headers.authorization) {
      return false;
    }
    ctx.user = this.validateToken(ctx.headers.authorization);
    return true;
  }

  //! this file will extract token from header
  //! token should be provided in as
  //! { "authorization": "Bearer TOKEN"}

  validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid Token');
    }
    const token = auth.split(' ')[1];
    try {
      return jwt.verify(token, myConfig.secretkey);
    } catch (err) {
      throw new UnauthorizedException('Invalid Token');
    }
  }
}
