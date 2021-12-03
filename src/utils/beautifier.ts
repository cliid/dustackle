import { Finedust } from '../types.d';

function beautifier(finedustData: Finedust) {
  const { pm10, pm25 } = finedustData;
  let pm10TextGrade = '';
  let pm25TextGrade = '';
  let specialMessage = '';
  if (pm10.grade === 1 && pm25.grade === 1) {
    pm10TextGrade = '좋음';
    specialMessage = '맑은 하늘이네요! 안심하시고 나가셔도 됩니다 🥰';
  } else if (pm25.grade * pm10.grade >= 2 && pm25.grade * pm10.grade <= 4) {
    pm10TextGrade = '보통';
    specialMessage = '그럭저럭 괜찮네요! 😉';
  } else if (pm25.grade * pm10.grade >= 5 && pm25.grade * pm10.grade <= 8) {
    pm10TextGrade = '나쁨';
    specialMessage = '꼭 마스크 챙기시고 나가셔야겠네요! 😷';
  } else if (pm25.grade * pm10.grade >= 9) {
    pm10TextGrade = '매우 나쁨';
    specialMessage = '오늘은 나가시지 않는게 좋을 것 같네요;;; 😱';
  } else {
    pm10TextGrade = 'N/A';
    specialMessage = '미세먼지 데이터에 문제가 생긴 것 같습니다; 서비스에 불편 드려 죄송합니다 😅';
  }
  if (pm25.grade === 1) {
    pm25TextGrade = '좋음';
  } else if (pm25.grade === 2) {
    pm25TextGrade = '보통';
  } else if (pm25.grade === 3) {
    pm25TextGrade = '나쁨';
  } else if (pm25.grade === 4) {
    pm25TextGrade = '매우 나쁨';
  } else pm25TextGrade = 'N/A';

  return (
    `미세먼지 농도: ${pm10.value}μg/㎥ ` +
    `(${pm10TextGrade}),\n` +
    `초미세먼지 농도: ${pm25.value}μg/㎥ ` +
    `(${pm25TextGrade}) 입니다.` +
    `\n\n${specialMessage}`
  );
}

export default beautifier;
