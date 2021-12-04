import Dialogflow from '@google-cloud/dialogflow';
import * as uuid from 'uuid';

import logger from '@/lib/logger';

const sessionClient = new Dialogflow.SessionsClient({
  credentials: JSON.parse(process.env.DIALOGFLOW_CREDENTIALS!),
});
const sessionId = uuid.v4();

export default async function dialogflow(query: string, languageCode: string, contexts?: string[]) {
  logger.info(`Query: ${query}`);
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(process.env.DIALOGFLOW_PROJECT_ID!, sessionId);

  // The text query request.
  let request: Record<string, any> = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode,
      },
    },
  };

  if (contexts && contexts.length > 0) {
    request = {
      ...request,
      queryParams: {
        contexts,
      },
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}
