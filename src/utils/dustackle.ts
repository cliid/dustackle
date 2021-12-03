import proj4 from 'proj4';
import nlp from './nlp';
import finedust from './finedust';
import beautifier from './beautifier';
import station from './station';
import search from './search';

const defaultResponse = '조금만 더 자세히 말씀해주시면 감사하겠습니다 ;)';

const dustackle = async (request: string): Promise<string> => {
  const result = await nlp(request);

  switch (result.intent?.displayName) {
    case 'Finedust': {
      // location found
      const location = result.parameters?.fields?.any.stringValue;
      if (location == null) {
        return defaultResponse; // TODO: handle exceptions properly.
      }

      const searchData = await search(location);

      const wgs84 = {
        x: parseFloat(searchData.response.result.items[0].point.x),
        y: parseFloat(searchData.response.result.items[0].point.y),
      };

      console.log(`API --- WGS84: ${wgs84.x}, ${wgs84.y}`);

      proj4.defs(
        'TM',
        '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43'
      );

      const utm = proj4('WGS84', 'TM').forward({ x: wgs84.x, y: wgs84.y });

      console.log(`API --- UTM: ${utm.x}, ${utm.y}`);

      const stationData = await station(utm);
      const { stationName } = stationData.response.body.items[0];
      const finedustData = await finedust(stationName);
      return beautifier(finedustData);
    }
    case 'DefaultFinedust': {
      return '조금만 더 자세히 말씀해주시면 감사하겠습니다 ;)';
    }
    default:
      return '뭐라고 말씀하셨는지 다시 한번 더 정확히 말씀해주세요... ㅠ';
  }
};

export default dustackle;
