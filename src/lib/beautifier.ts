import { Air, AirInfo, Grade } from '@/types';

const translate = (name: string): string => {
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

const metrics = (name: string): string => {
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

export default function beautifier(air: Air) {
  const arr: string[] = [];
  const order = ['pm10', 'pm25', 'co', 'o3', 'so2', 'no2', 'khai'];
  Object.entries(air)
    .sort((a, b) => {
      return order.indexOf(a[0]) - order.indexOf(b[0]);
    })
    .forEach((entry: [string, AirInfo]) => {
      const name = entry[0];
      const value = entry[1];
      let gradeInKorean: string;
      // If it's the overall air quality, just skip. Otherwise, go and append the string to `arr`.
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

  let specialMessage: string;
  switch (air.khai.grade) {
    case Grade.GOOD: {
      specialMessage = '맑은 하늘이네요! 안심하시고 나가셔도 됩니다 🥰';
      break;
    }
    case Grade.NORMAL: {
      specialMessage = '그럭저럭 괜찮네요! 😉';
      break;
    }
    case Grade.BAD: {
      specialMessage = '꼭 마스크 챙기시고 나가셔야겠네요 😷';
      break;
    }
    case Grade.WORST: {
      specialMessage = '오늘은 나가시지 않는게 좋을 것 같네요;;; 😱';
      break;
    }
    default: {
      specialMessage = '미세먼지 데이터에 문제가 생긴 것 같습니다. 서비스에 불편 드려 죄송합니다. 😅';
    }
  }

  return `${arr.join('')}\n${specialMessage}`;
}
