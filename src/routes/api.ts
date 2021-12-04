import { FastifyInstance } from 'fastify';

import air from '@/lib/air';
import facebook from '@/lib/facebook';
import logger from '@/lib/logger';
import messenger from '@/lib/messenger';
import nlp from '@/lib/nlp';
import { Messaging } from '@/types';

const APIRoute = async (server: FastifyInstance) => {
  server.post<{
    Body: {
      stationName: string;
    };
  }>('/air', {}, async (req, res) => {
    try {
      res.code(200).send(await air(req.body.stationName));
    } catch (error) {
      logger.error(error);
      res.send(500);
    }
  });

  server.post<{
    Body: {
      text: string;
    };
  }>('/nlp', {}, async (req, res) => {
    try {
      res.code(200).send(await nlp(req.body.text));
    } catch (error) {
      logger.error(error);
      res.send(500);
    }
  });

  server.post<{ Body: { text: string } }>('/messenger', {}, async (req, res) => {
    try {
      res.code(200).send(await messenger(req.body.text));
    } catch (error) {
      logger.error(error);
      res.code(500).send('내부적으로 문제가 생긴 것 같습니다. 최대한 신속히 해결하겠습니다.');
    }
  });

  // Facebook Messenger Webhook
  server.post<{
    Body: {
      object: string;
      entry: Array<{
        messaging: Array<Messaging>;
        id: string;
        time: number;
      }>;
    };
  }>('/webhook', {}, async (req, res) => {
    if (req.body.object === 'page') {
      // Just to be sure... it should be `page` for sure.
      // Iterates over each entry - there may be multiple if batched
      Promise.all(
        req.body.entry!.map((entry) =>
          // Run an IIFC
          (async () => {
            // Gets the message. entry.messaging is an array, but
            // will only ever contain one message, so we get index 0
            const recipientID = entry.messaging[0].sender.id;
            // He's the person who gets the message.
            if (entry.messaging[0].message) {
              // If it's a normal message, a.k.a. from the `messages` webhook.
              const { message } = entry.messaging[0];
              logger.info(`Message: ${message.text}, from User: ${recipientID}`);
              const response = await messenger(message.text);
              await facebook.sendText(recipientID, response);
            } else {
              // From `message_deliveries`
              // TODO
            }
          })()
        )
      )
        .then(() => {
          // No matter what, send code 200. (Facebook says to do so...)
          res.code(200).send('EVENT_RECEIVED');
        })
        .catch((error) => {
          logger.error(error);
        });
    } else {
      res.code(404).send('404 Not Found');
    }
  });

  server.get<{
    Querystring: {
      'hub.mode': string;
      'hub.verify_token': string;
      'hub.challenge': string;
    };
  }>('/webhook', {}, async (req, res) => {
    try {
      // Your verify token. Should be a random string.
      const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN!;

      // Parse the query params
      const mode = req.query['hub.mode'];
      const token = req.query['hub.verify_token'];
      const challenge = req.query['hub.challenge'];

      // Checks if a token and mode is in the query string of the request
      if (mode && token) {
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
          // Responds with the challenge token from the request
          logger.info('WEBHOOK_VERIFIED');
          res.code(200).send(challenge);
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.send(403);
        }
      }
    } catch (error) {
      logger.error(error);
      res.send(500);
    }
  });
};

export default APIRoute;
