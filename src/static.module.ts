import { Module } from '@nestjs/common';
import { StaticController } from './static.controller';
import { StaticService } from './static.service';

@Module({
  imports: [],
  controllers: [StaticController],
  providers: [StaticService]
})
export class StaticModule {}
