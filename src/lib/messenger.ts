import proj4 from 'proj4';

import quotes from '@/constants/quotes';
import air from '@/lib/air';
import beautifier from '@/lib/beautifier';
import logger from '@/lib/logger';
import nlp from '@/lib/nlp';
import locationToWGS84 from '@/lib/search';
import nearestFinedustStationName from '@/lib/station';

export default async function messenger(request: string): Promise<string> {
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
      return beautifier(finedustData);
    }
    case 'Default Finedust': {
      return '사용자의 위치에 알맞는 미세먼지를 불러오는 기능은 현재 구현중입니다! 사용해주셔서 감사합니다 ;)';
    }
    case 'Famous Quotes': {
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return `“${quote.quotation}”\n\n— ${quote.author}`;
    }
    default:
      return '잘 이해를 못하겠어요... :(';
  }
}
