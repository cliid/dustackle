import { Body, Injectable, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';

@Injectable()
export class AppService {
  constructor(
    private readonly config: ConfigService // ConfigService 불러오기
  ) {}

  hello(): string {
    return 'Akinaldo.';
  }

  login(@Body() body): Record<string, unknown> {
    return {
      access_token: '',
      love: true
    };
  }

  register(@Body() body): Record<string, unknown> {
    return {
      access_token: '',
      love: false
    };
  }

  webhook(@Body() body): string {
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
  }

  webhookVerification(@Req() req: Request, @Res() res: Response) {
    // Your verify token. Should be a random string.
    const VERIFY_TOKEN = this.config.get('FB_WEBHOOK_VERIFY_TOKEN');

    // Parse the query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log('WEBHOOK_VERIFIED');
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  }
}
