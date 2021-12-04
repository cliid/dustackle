import axios, { AxiosError } from 'axios';

import logger from '@/lib/logger';

// message: see https://developers.facebook.com/docs/messenger-platform/getting-started/quick-start
const sendMessage = async (id: string, message: Record<string, any>) => {
  logger.info(`Trying to send message ${JSON.stringify(message)} to user ${id}`);

  // Construct the message body
  await axios
    .post(
      `https://graph.facebook.com/v12.0/me/messages?${new URLSearchParams({
        access_token: process.env.FB_MESSENGER_ACCESS_TOKEN!,
      })}`,
      {
        recipient: {
          id,
        },
        message,
      }
    )
    .catch((error: AxiosError) => {
      logger.error('Failed sending message with error...');
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        logger.error(error.response.data);
        logger.error(error.response.status);
        logger.error(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        logger.error(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        logger.error('Error', error.message);
      }
      logger.error(error.config);
    });
};

const sendText = async (id: string, text: string) => {
  await sendMessage(id, { text });
};

export default { sendText, sendMessage };
