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

  @Post('/login')
  async login(@Body() body): Promise<Record<string, unknown>> {
    return this.appService.login(body);
  }

  @Post('/register')
  async register(@Body() body): Promise<Record<string, unknown>> {
    return this.appService.register(body);
  }

  @Post('/webhook')
  async webhook(@Body() body): Promise<string> {
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        const webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });

      // Returns a '200 OK' response to all requests
      return 'EVENT_RECEIVED';
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
    }
    return this.appService.webhook(body);
  }

  @Get('/webhook')
  webhookVerification(@Req() req: Request, @Res() res: Response) {
    return this.appService.webhookVerification(req, res);
  }
}
