import { Controller, Get } from '@nestjs/common';
import { StaticService } from './static.service';

@Controller()
export class StaticController {
  constructor(private readonly staticService: StaticService) {}

  @Get('/')
  async hello(): Promise<string> {
    return this.staticService.hello();
  }

  @Get('/privacy')
  privacy() {
    return this.staticService.privacy();
  }

  @Get('/terms')
  terms() {
    return this.staticService.terms();
  }
}
