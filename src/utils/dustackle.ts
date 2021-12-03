import proj4 from 'proj4';
import nlp from './nlp';
import finedust from './finedust';
import beautifier from './beautifier';
import station from './station';
import search from './search';

const defaultResponse = '엣... 제대로 알아듣지 못한 것 같아요 ㅜ 한번 다시 간략하게 물어봐주시겠어요?';

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

      if (!searchData || !searchData.response.result.items) {
        return defaultResponse;
      }

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
    case 'Default Finedust': {
      return '구현중입니다!';
    }
    case 'Famous Quotes': {
      const quotes = [
        {
          quotation: "If you don't make mistakes, you're not working on hard enough problems. And that's a mistake.",
          author: 'Frank Wilczek',
        },
        {
          quotation: 'It does not matter how slowly you go as long as you do not stop.',
          author: 'Confucius',
        },
        {
          quotation: 'Only I can change my life. No one can do it for me.',
          author: 'Carol Burnett',
        },
        {
          quotation:
            'With software there are only two possibilites: either the users control the programme or the programme controls the users. If the programme controls the users, and the developer controls the programme, then the programme is an instrument of unjust power.',
          author: 'Richard “Matthew” Stallman',
        },
        {
          quotation: "People said I should accept the world. Bullshit! I don't accept the world.",
          author: 'Richard “Matthew” Stallman',
        },
      ];
      const quote = quotes[Math.floor(Math.random() * quotes.length)];
      return `“${quote.quotation}”\n\n— ${quote.author}`;
    }
    default:
      return '잘 이해를 못하겠어요... :(';
  }
};

export default dustackle;
