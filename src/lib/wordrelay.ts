import logger from './logger';

export default async function wordrelay(word: string) {
  // next word relay word for `word`
  logger.info(`Word: ${word}`);
}
