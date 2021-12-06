import axios from 'axios';

import { Implementation, NaverGeocodeData, VWorldSearchData } from '@/types';

import { GoogleGeocodeData } from '../types';

const naverImplementation = async (location: string) => {
  const { data } = await axios.get<NaverGeocodeData>(
    `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?${new URLSearchParams({
      query: location,
    })}`,
    {
      headers: {
        'Accept': 'application/json',
        'X-NCP-APIGW-API-KEY-ID': process.env.NAVER_CLOUD_CLIENT_ID!,
        'X-NCP-APIGW-API-KEY': process.env.NAVER_CLOUD_CLIENT_SECRET!,
      },
    }
  );

  if (data.status !== 'OK') {
    throw new Error('Location not found.');
  }

  return {
    x: parseFloat(data.addresses[0].x),
    y: parseFloat(data.addresses[0].y),
    system: 'wgs84',
  };
};

const vworldImplementation = async (location: string) => {
  const { data } = await axios.get<VWorldSearchData>(
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
  );

  if (data.response.status === 'NOT_FOUND') {
    throw new Error('Location not found.');
  }

  return {
    x: parseFloat(data.response.result.items[0].point.x),
    y: parseFloat(data.response.result.items[0].point.y),
    system: 'wgs84',
  };
};

const googleImplementation = async (location: string) => {
  const { data } = await axios.get<GoogleGeocodeData>(
    `https://maps.googleapis.com/maps/api/geocode/json?${new URLSearchParams({
      address: location,
      key: process.env.GOOGLE_CLOUD_API_KEY!,
    })}`
  );

  if (data.status !== 'OK') {
    throw new Error('Location not found.');
  }

  return {
    x: data.results[0].geometry.location.lng,
    y: data.results[0].geometry.location.lat,
    system: 'wgs84',
  };
};

const coordinates = async (location: string, implementation: Implementation = 'naver') => {
  switch (implementation) {
    case 'naver': {
      return naverImplementation(location);
    }
    case 'vworld': {
      return vworldImplementation(location);
    }
    case 'google': {
      return googleImplementation(location);
    }
    default: {
      return {
        x: 127,
        y: 37,
        system: 'wgs84',
      };
    }
  }
};

export default coordinates;
