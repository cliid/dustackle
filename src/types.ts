export interface Attachment {
  type: string;
  payload: {
    url: string;
    title?: string;
  };
}

export interface Messaging {
  sender: {
    id: string;
  };
  recipient: {
    id: string;
  };
  timestamp?: number;
  message?: {
    mid: string;
    text: string;
    quick_reply?: {
      payload: string;
    };
    reply_to?: {
      mid: string;
    };
    attachments?: Array<Attachment>;
  };
  delivery?: {
    mids: Array<string>;
    watermark: number;
  };
}

export interface VWorldSearchData {
  response: {
    service: {
      name: string;
      version: string;
      operation: string;
      time: string;
    };
    status: string;
    record: {
      total: string;
      current: string;
    };
    page: {
      total: string;
      current: string;
      size: string;
    };
    result: {
      crs: 'EPSG:4326' | string;
      type: 'PLACE' | 'ADDRESS' | 'DISTRICT' | 'ROAD';
      items: Array<{
        id: string;
        title: string;
        category: string;
        address: {
          road: string;
          parcel: string;
        };
        point: {
          x: string;
          y: string;
        };
      }>;
    };
  };
}

export interface StationData {
  response: {
    body: {
      totalCount: number;
      items: Array<{
        tm: number;
        addr: string;
        stationName: string;
      }>;

      pageNo: number;
      numOfRows: number;
    };
    header: {
      resultMsg: string;
      resultCode: string;
    };
  };
}

// 1: 좋음, 2: 보통, 3: 나쁨, 4: 매우 나쁨
export enum Grade {
  GOOD = 1,
  NORMAL = 2,
  BAD = 3,
  WORST = 4,
}

export interface AirInfo {
  grade: Grade;
  value: number;
}

export interface Air {
  pm10: AirInfo; // 미세먼지
  pm25: AirInfo; // 초미세먼지
  o3: AirInfo; // 오존
  so2: AirInfo; // 아황산가스
  no2: AirInfo; // 이산화질소
  co: AirInfo; // 일산화탄소
  khai: AirInfo; // 전체적인 대기오염 정도
}

export interface AirQuality {
  so2Grade: string;
  coFlag: null;
  khaiValue: string;
  so2Value: string;
  coValue: string;
  pm25Flag?: null;
  pm10Flag: null;
  o3Grade: string;
  pm10Value: string;
  khaiGrade: string;
  pm25Value?: string;
  sidoName: string;
  no2Flag: null;
  no2Grade: string;
  o3Flag: null;
  pm25Grade?: string;
  so2Flag: null;
  dataTime: string;
  coGrade: string;
  no2Value: string;
  stationName: string;
  pm10Grade: string;
  o3Value: string;
}

export interface AirData {
  response: {
    body: {
      totalCount: number;
      items: Array<AirQuality>;
    };
  };
}

export interface Quote {
  quotation: string;
  author: string;
}

export type Quotes = Array<Quote>;
