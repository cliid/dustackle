import { Grade } from 'typings';

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, any> {
  // eslint-disable-next-line no-prototype-builtins
  return obj.hasOwnProperty(prop);
}

export function gradeToMsg(grade: Grade) {
  switch (grade) {
    case Grade.GOOD:
      return '좋음';
    case Grade.NORMAL:
      return '보통';
    case Grade.BAD:
      return '나쁨';
    case Grade.WORST:
      return '최악';
    default:
      return '몰?루';
  }
}
