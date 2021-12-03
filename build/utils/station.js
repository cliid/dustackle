"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const station = async (utm) => {
    const stationData = (await axios_1.default.get(`http://apis.data.go.kr/B552584/MsrstnInfoInqireSvc/getNearbyMsrstnList?${new URLSearchParams({
        serviceKey: process.env.AIRKOREA_API_SERVICE_KEY,
        returnType: 'json',
        tmX: utm.x.toString(),
        tmY: utm.y.toString(),
    })}`)).data;
    return stationData;
};
exports.default = station;
