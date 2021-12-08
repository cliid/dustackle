import proj4 from 'proj4';

import air from './air';
import coordinates from './coordinates';
import logger from './logger';
import nearest from './nearest';

export default async function airquery(location: string) {
  const wgs84 = await coordinates(location, 'google');

  logger.info(`WGS84: ${wgs84.address}, ${wgs84.x}, ${wgs84.y}`);

  proj4.defs(
    'TM',
    '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43'
  );

  const tm = proj4('WGS84', 'TM').forward({ x: wgs84.x, y: wgs84.y });

  logger.info(`TM: ${tm.x}, ${tm.y}`);

  const stationName = await nearest(tm);
  const data = await air(stationName);
  return { ...data, address: wgs84.address };
}
