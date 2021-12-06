import axios from 'axios';

import { StationData } from '@/types';

// Nearest Finedust Data Name
const nearest = async (tm: { x: number; y: number }) => {
  const { data } = await axios.get<StationData>(
    `http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?${new URLSearchParams({
      serviceKey: process.env.AIRKOREA_API_SERVICE_KEY!,
      returnType: 'json',
      tmX: tm.x.toString(),
      tmY: tm.y.toString(),
    })}`
  );

  return data.response.body.items[0].stationName;
};

export default nearest;
