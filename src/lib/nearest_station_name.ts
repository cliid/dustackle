import axios from 'axios';

import { Coord, StationData } from '@/types';

// Nearest Finedust Data Name
const nearestStationName = async (tm: Coord) => {
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

export default nearestStationName;
