import axios from 'axios';
import { VWorldSearchData } from '../types';

const search = async (location: string) => {
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

  return searchData;
};

export default search;
