import axios from 'axios';
import { AirData, AirQuality, Grade } from 'typings';

export default async function getAirData(station: string): Promise<AirData> {
  const queryURL = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?${new URLSearchParams(
    {
      ServiceKey: process.env.AIRKOREA_API_SERVICE_KEY!,
      stationName: station,
      dataTerm: 'DAILY',
      returnType: 'json',
      ver: '1.0',
      numOfRows: '1',
    }
  ).toString()}`;

  const { data } = await axios.get<{
    response: {
      body: {
        totalCount: number;
        items: AirQuality[];
      };
    };
  }>(queryURL);
  const item = data.response.body.items[0];

  return {
    pm10: {
      grade: parseInt(item.pm10Grade) as Grade,
      value: parseFloat(item.pm10Value),
    },
    pm25: {
      // B/C we queried with ver = '1.0' --> see API specification.
      grade: parseInt(item.pm25Grade!) as Grade,
      value: parseFloat(item.pm25Value!),
    },
    o3: {
      grade: parseInt(item.o3Grade) as Grade,
      value: parseFloat(item.o3Value),
    },
    so2: {
      grade: parseInt(item.so2Grade) as Grade,
      value: parseFloat(item.so2Value),
    },
    no2: {
      grade: parseInt(item.no2Grade) as Grade,
      value: parseFloat(item.no2Value),
    },
    co: {
      grade: parseInt(item.coGrade) as Grade,
      value: parseFloat(item.coValue),
    },
    khai: {
      grade: parseInt(item.khaiGrade) as Grade,
      value: parseFloat(item.khaiValue),
    },
  };
}
