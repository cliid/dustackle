import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';

@Controller('/api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  async hello(): Promise<string> {
    return this.appService.hello();
  }

  @Post('/finedust')
  async finedust(@Body() body: any): Promise<string> {
    return await this.appService.finedust(body.sido, body.gungu);
  }

  @Post('/nlp')
  async nlp(@Body() body: any): Promise<string> {
    return await this.appService.nlp(body.text);
  }

  @Post('/webhook')
  async webhook(@Body() body: any): Promise<string> {
    return await this.appService.webhook(body);
  }

  @Get('/webhook')
  webhookVerification(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.appService.webhookVerification(req, res);
  }
}
