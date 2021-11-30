import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiService } from './api.service';

@Controller('/api')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Post('/finedust')
  async finedust(@Body() body: any): Promise<string> {
    return await this.apiService.finedust(body.sido, body.gungu);
  }

  @Post('/nlp')
  async nlp(@Body() body: any): Promise<string> {
    return await this.apiService.nlp(body.text);
  }

  @Post('/webhook')
  async webhook(@Body() body: any): Promise<string> {
    return await this.apiService.webhook(body);
  }

  @Get('/webhook')
  webhookVerification(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.apiService.webhookVerification(req, res);
  }
}
