/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import dialogflow from '@google-cloud/dialogflow';
import { SessionsClient } from '@google-cloud/dialogflow/build/src/v2';
import * as uuid from 'uuid';

declare global {
  var sessionClient: SessionsClient | undefined;
  var sessionId: string | undefined;
}

const sessionClient =
  globalThis.sessionClient ||
  new dialogflow.SessionsClient({
    credentials: JSON.parse(process.env.DIALOGFLOW_CREDENTIALS!),
  });
const sessionId = globalThis.sessionId || uuid.v4();

export { sessionId, sessionClient };
