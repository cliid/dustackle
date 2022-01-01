import proj4 from 'proj4';

import hello from '@/constants/hello';
import quotes from '@/constants/quotes';
import beautifier from '@/lib/beautifier';
import facebook from '@/lib/facebook';
import getStationAir from '@/lib/get_station_air';
import logger from '@/lib/logger';
import nearestStationName from '@/lib/nearest_station_name';
import nlp from '@/lib/nlp';
import { Grade } from '@/types';

import laughing from '../constants/laughing';
import { translate } from './beautifier';
import coordinates from './coordinates';

// location: location query string (ex: 외대부고)
// order: ex: ['pm10', 'pm25', ...] -> 여기에 있는거만 출력함.
const airRelated = async (location: string, order: Array<string>) => {
  const queryType = order.length > 1 ? 'khai' : order[0];
  const wgs84 = await coordinates(location);

  logger.info(`WGS84: ${wgs84.x}, ${wgs84.y}`);

  proj4.defs(
    'TM',
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43'
  );

  const tm = proj4('WGS84', 'TM').forward({ x: wgs84.x, y: wgs84.y });

  logger.info(`TM: ${tm.x}, ${tm.y}`);

  const stationName = await nearestStationName(tm);
  const airData = await getStationAir(stationName);
  let summaryMsg: string;
  const translatedQueryType = translate(queryType);
  switch (airData[queryType].grade) {
    case Grade.GOOD: {
      summaryMsg = `우와, 맑은 하늘이네요! 🥰`;
      break;
    }
    case Grade.NORMAL: {
      summaryMsg = `그럭저럭 괜찮네요! 😉`;
      break;
    }
    case Grade.BAD: {
      summaryMsg = `KF94를 쓸 날이군요... 😷`;
      break;
    }
    case Grade.WORST: {
      summaryMsg = `${location} 쪽은 가시지 않는게 좋을 것 같아요. 😱`;
      break;
    }
    default: {
      summaryMsg = `${location}의 ${translatedQueryType} 데이터에 문제가 생긴 것 같습니다. 원활한 서비스 이용에 불편을 끼쳐 드려 죄송합니다. 😅`;
    }
  }
  const filteredAirData = Object.fromEntries(
    Object.entries(airData).filter((value) => typeof order.find((value0) => value0 === value[0]) !== 'undefined')
  );
  return `⚡ ${location} ⚡\n\n${beautifier(filteredAirData)}\n${summaryMsg}`;
};

export default async function messenger(request: string, id?: string): Promise<string> {
  const result = await nlp(request);

  switch (result.intent?.displayName) {
    case '공기':
    case '미세먼지':
    case '초미세먼지':
    case '일산화탄소':
    case '오존':
    case '아황산가스':
    case '이산화질소': {
      // location found
      const location = result.parameters?.fields?.any.stringValue;
      if (location == null) {
        throw new Error('Location not found...');
      }

      let order: string[];

      switch (result.intent.displayName) {
        case '공기':
          order = ['pm10', 'pm25', 'co', 'o3', 'so2', 'no2', 'khai'];
          break;
        case '미세먼지':
          order = ['pm10'];
          break;
        case '초미세먼지':
          order = ['pm25'];
          break;
        case '일산화탄소':
          order = ['co'];
          break;
        case '오존':
          order = ['o3'];
          break;
        case '아황산가스':
          order = ['so2'];
          break;
        case '이산화질소':
          order = ['no2'];
          break;
        default:
          order = [''];
          break;
      }

      return airRelated(location, order);
    }
    case '명언': {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return `제가 좋아하는 명언 중 하나입니다.\n\n“${quote.quotation}”\n\n— ${quote.author}`;
    }
    case '안녕': {
      return hello[Math.floor(Math.random() * hello.length)];
    }
    case '웃음': {
      return laughing[Math.floor(Math.random() * laughing.length)];
    }
    case '끝말잇기 시작': {
      if (id) {
        await Promise.resolve().then(() => facebook.sendText(id, '좋아요! 그럼 저부터 시작할게요 :)'));
        return '복숭아';
      }
      return '좋아요! 그럼 저부터 시작할게요 :)';
    }
    case '끝말잇기 그만': {
      return '오예! 제가 이겼어요오 ㅋㅋㅋ';
    }
    default: {
      // TODO: get access to https://developers.facebook.com/docs/messenger-platform/identity/user-profile/ by filing a form
      // TODO: -> change `사용자` to the actual username.
      return `저도 아직 많이 부족한지라, 사용자 분께서 하신 말씀이 무슨 뜻으로 하신 건지 잘 이해가 안돼요. 😅\n그래도, 꾸준히 성장하고, 새로운 기능도 추가되고 있으니, 기대해주세요! 🙌`;
    }
  }
}
