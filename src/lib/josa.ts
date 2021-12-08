function hasJong(string: string) {
  // string의 마지막 글자가 받침을 가지는지 확인
  return (string.charCodeAt(string.length - 1) - 0xac00) % 28 > 0;
}

const f = [
  (string: string) => {
    // 을/를 구분
    return hasJong(string) ? '을' : '를';
  },
  (string: string) => {
    // 은/는 구분
    return hasJong(string) ? '은' : '는';
  },
  (string: string) => {
    // 이/가 구분
    return hasJong(string) ? '이' : '가';
  },
  (string: string) => {
    // 와/과 구분
    return hasJong(string) ? '과' : '와';
  },
  (string: string) => {
    // 으로/로 구분
    return hasJong(string) ? '으로' : '로';
  },
];
const formats = {
  '을/를': f[0],
  '을': f[0],
  '를': f[0],
  '을를': f[0],
  '은/는': f[1],
  '은': f[1],
  '는': f[1],
  '은는': f[1],
  '이/가': f[2],
  '이': f[2],
  '가': f[2],
  '이가': f[2],
  '와/과': f[3],
  '와': f[3],
  '과': f[3],
  '와과': f[3],
  '으로/로': f[4],
  '으로': f[4],
  '로': f[4],
  '으로로': f[4],
};

const Josa = {
  c(word: string, format: string) {
    if (typeof Object.keys(formats).find((value) => value === format) === 'undefined')
      throw new Error('Invalid format!');
    return (formats as any)[format](word);
  },
  r(word: string, format: string) {
    return word + this.c(word, format);
  },
};

export default Josa;
