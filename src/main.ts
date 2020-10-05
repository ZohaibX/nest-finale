import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const myConfig: { port: number } = config.get('server');
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  } else {
    // app.enableCors({ origin : /* string or array of string */ }) // string will be the endpoint of our frontend website
    logger.log(`Accepting requests from origin "string"`);
  }

  const port = process.env.PORT || myConfig.port;
  await app.listen(port);
  logger.verbose(`App is listening on the ${port}`);
}
bootstrap();
