export interface FinedustAttr {
  stationName: string;
}

export interface NLPAttr {
  text: string;
}

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

export interface WebhookAttr {
  object: string;
  entry: Array<{ messaging: Array<Messaging>; id: string; time: number }>;
}

export interface WebhookQuerystring {
  'hub.mode': string;
  'hub.verify_token': string;
  'hub.challenge': string;
}

export interface FinedustItem {
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

export interface FinedustData {
  response: {
    body: {
      totalCount: number;
      items: Array<FinedustItem>;
    };
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

export interface Finedust {
  pm10: { grade: number; value: number };
  pm25: { grade: number; value: number };
}
