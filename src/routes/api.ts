import { FastifyInstance } from 'fastify';
import { FinedustAttr, WebhookAttr, NLPAttr, WebhookQuerystring } from '../types.d';
import dustackle from '../utils/dustackle';
import finedust from '../utils/finedust';
import nlp from '../utils/nlp';
import facebook from '../utils/facebook';

const APIRoute = async (server: FastifyInstance) => {
  server.post<{ Body: FinedustAttr }>('/finedust', {}, async (req, res) => {
    try {
      res.code(200).send(await finedust(req.body.stationName));
    } catch (error) {
      req.log.error(`API --- ${error}`);
      res.send(500);
    }
  });

  server.post<{ Body: NLPAttr }>('/nlp', {}, async (req, res) => {
    try {
      res.code(200).send(await nlp(req.body.text));
    } catch (error) {
      req.log.error(`API --- ${error}`);
      res.send(500);
    }
  });

  server.post<{ Body: { text: string } }>('/dustackle', {}, async (req, res) => {
    try {
      res.code(200).send(await dustackle(req.body.text));
    } catch (error) {
      req.log.error(`API --- ${error}`);
      res.send(500);
    }
  });

  // Facebook Messenger Webhook
  server.post<{ Body: WebhookAttr }>('/webhook', {}, async (req, res) => {
    try {
      if (req.body.object === 'page') {
        // Just to be sure...
        // Iterates over each entry - there may be multiple if batched
        req.body.entry!.forEach(async (entry) => {
          // Gets the message. entry.messaging is an array, but
          // will only ever contain one message, so we get index 0
          const senderID = entry.messaging[0].sender.id;
          if (entry.messaging[0].message) {
            // If it's a normal message, a.k.a. from the `messages` webhook.
            const { message } = entry.messaging[0];
            console.log(`API --- Message: ${message.text}, from User: ${senderID}`);

            const response = await dustackle(message.text);
            facebook.sendText(senderID, response);
            res.code(200).send(response);
          } else {
            // From `message_deliveries`
            // TODO
          }
        });
      }
    } catch (error) {
      req.log.error(`API --- ${error}`);
      res.send(500);
    }
  });

  server.get<{ Querystring: WebhookQuerystring }>('/webhook', {}, async (req, res) => {
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
          console.log('API --- WEBHOOK_VERIFIED');
          res.code(200).send(challenge);
        } else {
          // Responds with '403 Forbidden' if verify tokens do not match
          res.send(403);
        }
      }
    } catch (error) {
      req.log.error(`API --- ${error}`);
      res.send(500);
    }
  });
};

export default APIRoute;
