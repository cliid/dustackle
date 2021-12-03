import logger from '../logger';
import dialogflow from './dialogflow';

const nlp = async (text: string) => {
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
};

export default nlp;
