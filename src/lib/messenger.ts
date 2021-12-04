import proj4 from 'proj4';

import quotes from '@/constants/quotes';
import air from '@/lib/air';
import beautifier from '@/lib/beautifier';
import facebook from '@/lib/facebook';
import logger from '@/lib/logger';
import nlp from '@/lib/nlp';
import locationToWGS84 from '@/lib/search';
import nearestFinedustStationName from '@/lib/station';
import { Grade } from '@/types';

export default async function messenger(request: string, id?: string): Promise<string> {
  const result = await nlp(request);

  switch (result.intent?.displayName) {
    case 'Finedust': {
      // location found
      const location = result.parameters?.fields?.any.stringValue;
      if (location == null) {
        throw new Error('Finedust location not found...');
      }

      const wgs84 = await locationToWGS84(location);

      logger.info(`WGS84: ${wgs84.x}, ${wgs84.y}`);

      proj4.defs(
        'TM',
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43'
      );

      const tm = proj4('WGS84', 'TM').forward({ x: wgs84.x, y: wgs84.y });

      logger.info(`TM: ${tm.x}, ${tm.y}`);

      const stationName = await nearestFinedustStationName(tm);
      const finedustData = await air(stationName);
      let specialMessage: string;
      switch (finedustData.khai.grade) {
        case Grade.GOOD: {
          specialMessage = `우와, 맑은 하늘이네요! 안심하시고 나가셔도 됩니다 🥰`;
          break;
        }
        case Grade.NORMAL: {
          specialMessage = `${location}의 공기는 그럭저럭 괜찮네요! 😉`;
          break;
        }
        case Grade.BAD: {
          specialMessage = `${location} 가실 때에는 KF94 쓰시는거, 잊지 마세요! 😷`;
          break;
        }
        case Grade.WORST: {
          specialMessage = `오늘은 ${location} 쪽으로는 가시지 않는게 좋을 것 같네요;;; 후덜덜... 😱`;
          break;
        }
        default: {
          specialMessage = `${location}의 미세먼지 데이터에 문제가 생긴 것 같습니다. 원활한 서비스 이용에 불편을 끼쳐 드려 죄송합니다. 😅`;
        }
      }
      return `⚡ ${location}의 대기 정보입니다. ⚡\n\n${beautifier(finedustData)}\n${specialMessage}`;
    }
    case 'Default Finedust': {
      return '사용자의 위치에 알맞는 미세먼지를 불러오는 기능은 아직 구현중입니다! 사용해주셔서 감사합니다 ;)';
    }
    case 'Famous Quotes': {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return `제가 좋아하는 명언 중 하나입니다.\n\n“${quote.quotation}”\n\n— ${quote.author}`;
    }
    case 'Start Word Relay': {
      // 끝말잇기 시작
      if (id) {
        await Promise.resolve().then(() => facebook.sendText(id, '좋아요! 그럼 저부터 시작할게요 :)'));
        return '복숭아';
      }
      return '좋아요! 그럼 저부터 시작할게요 :)';
    }
    default: {
      // TODO: get access to https://developers.facebook.com/docs/messenger-platform/identity/user-profile/ by filing a form
      // TODO: -> change `사용자` to the actual username.
      return `저도 아직 많이 부족한지라, 사용자 분께서 하신 말씀이 무슨 뜻으로 하신 건지는 잘 이해가 안돼요. 😅\n그래도, 지금도 꾸준히 계속 성장하고, 새로운 기능도 추가되고 있으니, 기대해주세요! 🙌`;
    }
  }
}
