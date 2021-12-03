import dialogflow from './dialogflow';

const nlp = async (text: string) => {
  const response = await dialogflow(text, 'ko-KR');
  console.log('NLP --- Detected intent');
  const result = response.queryResult!;
  console.log(`NLP ---   Query: ${result.queryText}`);
  console.log(`NLP ---   Response: ${result.fulfillmentText}`);
  if (result.intent) {
    console.log(`NLP ---   Intent: ${result.intent.displayName}`);
  } else {
    console.log('NLP ---   No intent matched.');
  }
  return result;
};

export default nlp;
