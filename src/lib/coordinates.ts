import axios from 'axios';

import { Coord, Implementation, NaverGeocodeData, VWorldSearchData } from '@/types';

import { GoogleGeocodeData } from '../types';

class Implementations {
  private location: string;

  constructor(_location: string) {
    this.location = _location;
  }

  public async naver(): Promise<Coord> {
    const { data } = await axios.get<NaverGeocodeData>(
      `https://naveropenapi.apigw.ntruss.com/map-geocode/v2/geocode?${new URLSearchParams({
        query: this.location,
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
    };
  }

  public async vworld(): Promise<Coord> {
    const { data } = await axios.get<VWorldSearchData>(
      `https://api.vworld.kr/req/search?${new URLSearchParams({
        key: process.env.VWORLD_ACCESS_TOKEN!,
        service: 'search',
        version: '2.0',
        request: 'search',
        format: 'json',
        errorFormat: 'json',
        query: this.location,
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
    };
  }

  public async google(): Promise<Coord> {
    const { data } = await axios.get<GoogleGeocodeData>(
      `https://maps.googleapis.com/maps/api/geocode/json?${new URLSearchParams({
        address: this.location,
        key: process.env.GOOGLE_CLOUD_API_KEY!,
        language: 'ko',
      })}`
    );

    if (data.status !== 'OK') {
      throw new Error('Location not found.');
    }

    return {
      x: data.results[0].geometry.location.lng,
      y: data.results[0].geometry.location.lat,
    };
  }
}

const coordinates = async (location: string, implementation: Implementation = 'google'): Promise<Coord> => {
  const implementations = new Implementations(location);
  switch (implementation) {
    case 'naver': {
      return implementations.naver();
    }
    case 'vworld': {
      return implementations.vworld();
    }
    case 'google': {
      return implementations.google();
    }
    default: {
      return {
        x: 127,
        y: 37,
      };
    }
  }
};

export default coordinates;
