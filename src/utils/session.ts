import dialogflow from '@google-cloud/dialogflow';
import { SessionsClient } from '@google-cloud/dialogflow/build/src/v2';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

declare global {
  // eslint-disable-next-line no-var
  var sessionClient: SessionsClient | undefined;
  // eslint-disable-next-line no-var
  var sessionId: string | undefined;
}

const sessionClient = global.sessionClient || new dialogflow.SessionsClient({});
const sessionId = global.sessionId || uuid.v4();

export { sessionId, sessionClient };
