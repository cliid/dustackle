import { FastifyInstance } from 'fastify';
import { FinedustAttr, WebhookAttr, NLPAttr, WebhookQuerystring } from '../types.d';
import dustackle from '../utils/dustackle';
import finedust from '../utils/finedust';
import nlp from '../utils/nlp';
import Facebook from '../utils/facebook';

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
        // Iterates over each entry - there may be multiple if batched
        req.body.entry!.forEach((entry) => {
          // Gets the message. entry.messaging is an array, but
          // will only ever contain one message, so we get index 0
          const webhookEvent = entry.messaging[0];
          console.log(webhookEvent);
        });

        // Returns a '200 OK' response to all requests
        res.code(200).send('EVENT_RECEIVED');
        return;
      }
      // If it's not from a page, and rather directly from the messenger...
      const senderID = req.body.sender.id;
      const message = req.body.message.text;
      console.log(`API --- Message: ${message}, from User: ${senderID}`);

      const response = await dustackle(message);
      Facebook.send(senderID, response);
      res.code(200).send(response);
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
