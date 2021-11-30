import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/v1.0/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async hello(): Promise<string> {
    return 'Akinaldo.';
  }

  @Post('/login')
  async login(@Body() body): Promise<Record<string, unknown>> {
    return {
      access_token: '',
    };
  }

  @Post('/register')
  async register(@Body() body): Promise<Record<string, unknown>> {
    return {};
  }
}
