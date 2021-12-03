"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const search = async (location) => {
    const searchData = (await axios_1.default.get(`https://api.vworld.kr/req/search?${new URLSearchParams({
        key: process.env.VWORLD_ACCESS_TOKEN,
        service: 'search',
        version: '2.0',
        request: 'search',
        format: 'json',
        errorFormat: 'json',
        query: location,
        type: 'PLACE',
        size: '1',
    })}`)).data;
    return searchData;
};
exports.default = search;
