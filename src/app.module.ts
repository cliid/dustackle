import { Module } from '@nestjs/common';
import { ApiModule } from './api.module';
import { StaticModule } from './static.module';

@Module({
  imports: [ApiModule, StaticModule]
})
export class AppModule {}
