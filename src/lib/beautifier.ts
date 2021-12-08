import { Grade } from '@/types';

export const translate = (name: string) => {
  switch (name) {
    case 'pm10': {
      return '미세먼지';
    }
    case 'pm25': {
      return '초미세먼지';
    }
    case 'o3': {
      return '오존';
    }
    case 'so2': {
      return '아황산가스';
    }
    case 'no2': {
      return '이산화질소';
    }
    case 'co': {
      return '일산화탄소';
    }
    case 'khai': {
      return '통합대기환경수치';
    }
    default: {
      return 'N/A';
    }
  }
};

export const metrics = (name: string) => {
  switch (name) {
    case 'pm10': {
      return 'μg/㎥';
    }
    case 'pm25': {
      return 'μg/㎥';
    }
    case 'o3': {
      return 'ppm';
    }
    case 'so2': {
      return 'ppm';
    }
    case 'no2': {
      return 'ppm';
    }
    case 'co': {
      return 'ppm';
    }
    case 'khai': {
      return 'CAI';
    }
    default: {
      return 'N/A';
    }
  }
};

export default function beautifier(air: {
  [key: string]: {
    grade: Grade;
    value: number;
  };
}) {
  const arr: string[] = [];
  const order = ['pm10', 'pm25', 'co', 'o3', 'so2', 'no2', 'khai'];
  Object.entries(air)
    .sort((a, b) => {
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
    .forEach((entry) => {
      const name = entry[0];
      const value = entry[1];
      let gradeInKorean: string;
      switch (value.grade) {
        case Grade.GOOD: {
          gradeInKorean = '좋음';
          break;
        }
        case Grade.NORMAL: {
          gradeInKorean = '보통';
          break;
        }
        case Grade.BAD: {
          gradeInKorean = '나쁨';
          break;
        }
        case Grade.WORST: {
          gradeInKorean = '매우 나쁨';
          break;
        }
        default: {
          gradeInKorean = 'N/A';
        }
      }
      arr.push(`${translate(name)}: ${gradeInKorean} (${value.value}${metrics(name)})\n`);
    });

  return `${arr.join('')}`.trim();
}
