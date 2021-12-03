import axios from 'axios';
import { Finedust, FinedustData } from '../types';

const finedust = async (stationName: string): Promise<Finedust> => {
  const queryURL = `http://apis.data.go.kr/B552584/ArpltnInforInqireSvc/getMsrstnAcctoRltmMesureDnsty?${new URLSearchParams(
    {
      ServiceKey: process.env.AIRKOREA_API_SERVICE_KEY!,
      stationName,
      dataTerm: 'DAILY',
      returnType: 'json',
      ver: '1.0',
      numOfRows: '1',
    }
  ).toString()}`;

  const response = (await axios.get<FinedustData>(queryURL)).data;
  const { pm10Grade, pm10Value, pm25Grade, pm25Value } = response.response.body.items[0];
  const finedustData = {
    pm10: {
      grade: parseInt(pm10Grade),
      value: parseInt(pm10Value),
    },
    pm25: {
      grade: parseInt(pm25Grade!),
      value: parseInt(pm25Value!),
    },
  };

  return finedustData;
};

export default finedust;
