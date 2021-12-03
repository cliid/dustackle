import axios from 'axios';
import { StationData } from '../types';

const station = async (utm: { x: number; y: number }) => {
  const stationData = (
    await axios.get<StationData>(
      `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?${new URLSearchParams({
        serviceKey: process.env.AIRKOREA_API_SERVICE_KEY!,
        returnType: 'json',
        tmX: utm.x.toString(),
        tmY: utm.y.toString(),
      })}`
    )
  ).data;
  return stationData;
};

export default station;
