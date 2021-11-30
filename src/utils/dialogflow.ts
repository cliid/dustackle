import { sessionClient, sessionId } from './session';

async function detectIntent(query: string, languageCode: string, contexts?: string[]) {
  // The path to identify the agent that owns the created intent.
  const sessionPath = sessionClient.projectAgentSessionPath(
    process.env.DIALOGFLOW_PROJECT_ID,
    sessionId
  );

  // The text query request.
  let request: Record<string, any> = {
    session: sessionPath,
    queryInput: {
      text: {
        text: query,
        languageCode: languageCode
      }
    }
  };

  if (contexts && contexts.length > 0) {
    request = {
      ...request,
      queryParams: {
        contexts: contexts
      }
    };
  }

  const responses = await sessionClient.detectIntent(request);
  return responses[0];
}

export { detectIntent };
