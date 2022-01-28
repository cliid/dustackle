import { Code } from 'typings';

import nlp from '@/lib/nlp';

import air from './air';
import Josa from './josa';
import translate from './translate';
import { gradeToMsg, hasOwnProperty } from './utils';

const airs = {
  AIR: 'khai',
  PM10: 'pm10',
  PM25: 'pm25',
  CO: 'co',
  O3: 'o3',
  SO2: 'so2',
  NO2: 'no2',
};

export default async function reply(request: string): Promise<string> {
  const result = await nlp(request);

  if (!result?.intent?.displayName) return '자연어 처리 과정에서 문제가 생긴 것 같아요. 😅';

  const intent = result.intent.displayName;

  if (hasOwnProperty(airs, intent)) {
    const location = result.parameters?.fields?.any?.stringValue;

    if (!location) throw new Error('Location not found.');

    const data = await air(location);

    const code = airs[intent] as Code;

    const translated = translate(code);

    return `«${location}»의 ${Josa.r(translated.text, '은는')} "${gradeToMsg(data[code].grade)}" 입니다. (${
      data[code].value
    }${translated.metric})`;
  }

  if (intent === 'GREETINGS') {
    return '안녕하세요, 미세봇입니다 ;)';
  }

  return '잘 이해가 안돼요. 😅';
}
