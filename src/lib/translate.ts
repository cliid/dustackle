import { Code } from 'typings';

const obj: { [key in Code]: { text: string; metric: string } } = {
  pm10: {
    text: '미세먼지',
    metric: 'μg/㎥',
  },
  pm25: {
    text: '초미세먼지',
    metric: 'μg/㎥',
  },
  o3: {
    text: '오존',
    metric: 'ppm',
  },
  so2: {
    text: '아황산가스',
    metric: 'ppm',
  },
  no2: {
    text: '이산화질소',
    metric: 'ppm',
  },
  co: {
    text: '일산화탄소',
    metric: 'ppm',
  },
  khai: {
    text: '공기',
    metric: 'CAI',
  },
};

const translate = (name: Code) => {
  return obj[name];
};

export default translate;
