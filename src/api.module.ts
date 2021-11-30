import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required()
      })
    }),
    ConfigService
  ],
  controllers: [ApiController],
  providers: [ApiService]
})
export class ApiModule {}
