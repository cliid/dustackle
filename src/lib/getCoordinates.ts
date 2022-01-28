import axios from 'axios';
import { Coordinates } from 'typings';

import { GoogleGeocodeData } from '../typings';

const getCoordinates = async (location: string): Promise<Coordinates> => {
  const { data } = await axios.get<GoogleGeocodeData>(
    `https://maps.googleapis.com/maps/api/geocode/json?${new URLSearchParams({
      address: location,
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
};

export default getCoordinates;
