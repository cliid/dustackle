import { FastifyInstance } from 'fastify';
import { Messaging } from 'typings';

import facebook from '@/lib/facebook';
import logger from '@/lib/logger';
import reply from '@/lib/reply';

const APIRoute = async (server: FastifyInstance) => {
  server.post<{ Body: { text: string } }>('/messenger', {}, async (req, res) => {
    try {
      res.code(200).send(await reply(req.body.text));
    } catch (error) {
      logger.error(error);
      res.code(500).send('내부적으로 문제가 생긴 것 같습니다. 원활한 서비스 이용에 불편을 끼쳐 드려 죄송합니다.');
    }
  });

  // Facebook Messenger Webhook
  server.post<{
    Body: {
      object: string;
      entry: Array<{
        messaging: Messaging[];
        id: string;
        time: number;
      }>;
    };
  }>('/webhook', {}, async (req, res) => {
    if (req.body.object === 'page') {
      // Just to be sure.... It should definitely be `page`.
      // Iterates over each entry, one by one - there may be multiple if batched
      req.body
        .entry!.reduce((p, entry) => {
          return p.then(() =>
            // It's a Promise-returning IIFE
            (async () => {
              // Gets the message. entry.messaging is an array, but
              // will only ever contain one message, so we get index 0
              const recipientID = entry.messaging[0].sender.id;
              // He's the person who gets the message.
              if (entry.messaging[0].message) {
                // If it's a normal message, a.k.a. from the `messages` webhook.
                const { message } = entry.messaging[0];
                logger.info(`Message: ${message.text}, from User: ${recipientID}`);
                try {
                  const response = await reply(message.text);
                  await facebook.sendText(recipientID, response);
                } catch (error) {
                  logger.error(error);
                  await facebook.sendText(
                    recipientID,
                    '내부적으로 문제가 생긴 것 같습니다. 원활한 서비스 이용에 불편을 끼쳐 드려 죄송합니다.'
                  );
                }
              } else {
                // From `message_deliveries`
                // TODO
              }
            })()
          );
        }, Promise.resolve())
        .then(() => {
          // No matter what, send code 200. (Facebook says to do so...)
          res.code(200).send('EVENT_RECEIVED');
        });
      await res;
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
