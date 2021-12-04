import dotenv from 'dotenv';
import Fastify from 'fastify';
import { fastifyEnv } from 'fastify-env';

import logger from '@/lib/logger';

dotenv.config();

const fastify = Fastify({ logger });

const schema = {
  type: 'object',
  required: [
    'FB_MESSENGER_ACCESS_TOKEN',
    'FB_WEBHOOK_VERIFY_TOKEN',
    'DIALOGFLOW_PROJECT_ID',
    'DIALOGFLOW_CREDENTIALS',
    'VWORLD_ACCESS_TOKEN',
    'AIRKOREA_API_SERVICE_KEY',
  ],
  properties: {
    FB_MESSENGER_ACCESS_TOKEN: {
      type: 'string',
      default: '',
    },
    FB_WEBHOOK_VERIFY_TOKEN: {
      type: 'string',
      default: '',
    },
    DIALOGFLOW_PROJECT_ID: {
      type: 'string',
      default: '',
    },
    DIALOGFLOW_CREDENTIALS: {
      type: 'string',
      default: '',
    },
    VWORLD_ACCESS_TOKEN: {
      type: 'string',
      default: '',
    },
    AIRKOREA_API_SERVICE_KEY: {
      type: 'string',
      default: '',
    },
  },
};

const options = {
  dotenv: true,
  data: process.env,
  schema,
  confKey: 'config',
};

// register plugin below:

const initialize = async () => {
  fastify.register(fastifyEnv, options);
  await fastify.after();
  fastify.register(import('../routes/api'), { prefix: '/api' });
  fastify.register(import('../routes/static'));
};
initialize();

// Fire up the server
(async () => {
  try {
    await fastify.ready();
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
})();
