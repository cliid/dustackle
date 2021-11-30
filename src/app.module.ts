import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production').required()
      })
    }),
    ConfigService,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client')
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
