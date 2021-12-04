import dialogflow from '@/lib/dialogflow';
import logger from '@/lib/logger';

export default async function nlp(text: string) {
  const response = await dialogflow(text, 'ko-KR');
  logger.info('Detected intent');
  const result = response.queryResult!;
  logger.info(`  Query: ${result.queryText}`);
  logger.info(`  Response: ${result.fulfillmentText}`);
  if (result.intent) {
    logger.info(`  Intent: ${result.intent.displayName}`);
  } else {
    logger.error('  No intent matched.');
  }
  return result;
}
