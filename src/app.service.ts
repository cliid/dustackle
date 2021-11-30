import { Body, Injectable, NotImplementedException, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { detectIntent } from './utils/dialogflow';
import { beautifier } from './utils/beautifier';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { URLSearchParams } from 'url';

@Injectable()
export class AppService {
  constructor(private readonly config: ConfigService, private httpService: HttpService) {}

  hello(): string {
    return 'Akinaldo.';
  }

  async finedust(sido: string, gungu: string): Promise<string> {
    // sido: `서울` 과 같은 형식, not `서울특별시` or `서울시`
    // gungu: `강남구` 와 같은 형식, not `강남`.
    const baseURL = 'http://apis.data.go.kr/B552584/ArpltnInforInqireSvc';

    const gunguURL = `${baseURL}/getMsrstnAcctoRltmMesureDnsty?${new URLSearchParams({
      ServiceKey: process.env.AIRKOREA_FINEDUST_API_SERVICE_KEY,
      stationName: gungu,
      dataTerm: 'DAILY',
      returnType: 'json',
      ver: '1.0'
    }).toString()}`;
    const sidoURL = `${baseURL}/getCtprvnRltmMesureDnsty?${new URLSearchParams({
      ServiceKey: process.env.AIRKOREA_FINEDUST_API_SERVICE_KEY,
      sidoName: sido,
      dataTerm: 'DAILY',
      returnType: 'json',
      ver: '1.0',
      numOfRows: '9999'
    }).toString()}`;

    let response: any;
    let finedustData: any = { sido, gungu };

    if (sido != null && gungu != null) {
      response = await (await lastValueFrom(this.httpService.get(sidoURL))).data;
      const { pm10Grade, pm10Value, pm25Grade, pm25Value } = (
        response.response.body.items as Array<Record<string, any>>
      ).find((value) => value.stationName === gungu);
      finedustData = {
        ...finedustData,
        pm10: {
          grade: parseInt(pm10Grade),
          value: parseInt(pm10Value)
        },
        pm25: {
          grade: parseInt(pm25Grade),
          value: parseInt(pm25Value)
        }
      };
    } else if (sido != null) {
      // TODO: average all things...
      response = await (await lastValueFrom(this.httpService.get(sidoURL))).data;
      /* const obj = (response.response.body.items as Array<Record<string, any>>).reduce(
        (prev, curr) => {
          return {
            pm10: {
              grade: prev.pm10.grade + parseInt(curr.pm10Grade),
              value: prev.pm10.value + parseInt(curr.pm10Value)
            },
            pm25: {
              grade: prev.pm25.grade + parseInt(curr.pm25Grade),
              value: prev.pm25.value + parseInt(curr.pm25Value)
            }
          };
        }
      );
      obj.pm10.grade /= response.response.body.items.length;
      obj.pm10.value /= response.response.body.items.length;
      obj.pm25.grade /= response.response.body.items.length;
      obj.pm25.value /= response.response.body.items.length;
      finedustData = {
        ...finedustData,
        ...obj
      }; */
      const { pm10Grade, pm10Value, pm25Grade, pm25Value } = response.response.body.items[0];
      finedustData = {
        ...finedustData,
        pm10: {
          grade: parseInt(pm10Grade),
          value: parseInt(pm10Value)
        },
        pm25: {
          grade: parseInt(pm25Grade),
          value: parseInt(pm25Value)
        }
      };
    } else if (gungu != null) {
      response = await (await lastValueFrom(this.httpService.get(gunguURL))).data;
      const { pm10Grade, pm10Value, pm25Grade, pm25Value } = response.response.body.items[0];
      finedustData = {
        ...finedustData,
        pm10: {
          grade: parseInt(pm10Grade),
          value: parseInt(pm10Value)
        },
        pm25: {
          grade: parseInt(pm25Grade),
          value: parseInt(pm25Value)
        }
      };
    } else {
      // TODO: return user's location's sido & gungu -> get fine dust level
      throw new NotImplementedException('Have to get user location');
    }

    return beautifier(finedustData);
  }

  async nlp(text: string): Promise<any> {
    const response = await detectIntent(text, 'ko-KR');
    console.log('Detected intent');
    const result = response.queryResult;
    console.log(`  Query: ${result.queryText}`);
    console.log(`  Response: ${result.fulfillmentText}`);
    if (result.intent) {
      console.log(`  Intent: ${result.intent.displayName}`);
    } else {
      console.log('  No intent matched.');
    }
  }

  async webhook(@Body() body: Record<string, any>): Promise<string> {
    if (body.object === 'page') {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry: any) {
        // Gets the message. entry.messaging is an array, but
        // will only ever contain one message, so we get index 0
        const webhook_event = entry.messaging[0];
        console.log(webhook_event);
      });

      // Returns a '200 OK' response to all requests
      return 'EVENT_RECEIVED';
    } else {
      // If it's not from a page, and rather directly from the messenger...
      const userId = body.sender.id;
      const message: string = body.message.text;
      console.log(`Message: ${message}, from User: ${userId}`);
      this.nlp(message);
      const sido = '서울',
        gungu = '강남구';
      return await this.finedust(sido, gungu);
    }
  }

  webhookVerification(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
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
