import axios from 'axios';

import { VWorldSearchData } from '@/types';

const locationToWGS84 = async (location: string) => {
  const searchData = (
    await axios.get<VWorldSearchData>(
      `https://api.vworld.kr/req/search?${new URLSearchParams({
        key: process.env.VWORLD_ACCESS_TOKEN!,
        service: 'search',
        version: '2.0',
        request: 'search',
        format: 'json',
        errorFormat: 'json',
        query: location,
        type: 'PLACE',
        size: '1',
      })}`
    )
  ).data;

  if (searchData.response.status === 'NOT_FOUND') {
    throw new Error('Location not found.');
  }

  return {
    x: parseFloat(searchData.response.result.items[0].point.x),
    y: parseFloat(searchData.response.result.items[0].point.y),
  };
};

export default locationToWGS84;
