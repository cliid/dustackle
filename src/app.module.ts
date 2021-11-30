import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod', // When production stage, we'll use Vercel's own Environment Variable settings.
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod', 'test').required(),
        FB_MESSENGER_ACCESS_TOKEN: Joi.string().required(),
        FB_WEBHOOK_VERIFY_TOKEN: Joi.string().required()
      })
    }),
    ConfigService
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
