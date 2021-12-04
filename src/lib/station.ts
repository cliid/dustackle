import axios from 'axios';

import { StationData } from '@/types';

const nearestFinedustStationName = async (tm: { x: number; y: number }) => {
  const stationData = (
    await axios.get<StationData>(
      `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?${new URLSearchParams({
        serviceKey: process.env.AIRKOREA_API_SERVICE_KEY!,
        returnType: 'json',
        tmX: tm.x.toString(),
        tmY: tm.y.toString(),
      })}`
    )
  ).data;

  return stationData.response.body.items[0].stationName;
};

export default nearestFinedustStationName;
