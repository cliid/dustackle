"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const proj4_1 = __importDefault(require("proj4"));
const nlp_1 = __importDefault(require("./nlp"));
const finedust_1 = __importDefault(require("./finedust"));
const beautifier_1 = __importDefault(require("./beautifier"));
const station_1 = __importDefault(require("./station"));
const search_1 = __importDefault(require("./search"));
const defaultResponse = '조금만 더 자세히 말씀해주시면 감사하겠습니다 ;)';
const dustackle = async (request) => {
    const result = await (0, nlp_1.default)(request);
    switch (result.intent?.displayName) {
        case 'Finedust': {
            // location found
            const location = result.parameters?.fields?.any.stringValue;
            if (location == null) {
                return defaultResponse; // TODO: handle exceptions properly.
            }
            const searchData = await (0, search_1.default)(location);
            const wgs84 = {
                x: parseFloat(searchData.response.result.items[0].point.x),
                y: parseFloat(searchData.response.result.items[0].point.y),
            };
            console.log(`API --- WGS84: ${wgs84.x}, ${wgs84.y}`);
            proj4_1.default.defs('TM', '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs +towgs84=-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43');
            const utm = (0, proj4_1.default)('WGS84', 'TM').forward({ x: wgs84.x, y: wgs84.y });
            console.log(`API --- UTM: ${utm.x}, ${utm.y}`);
            const stationData = await (0, station_1.default)(utm);
            const { stationName } = stationData.response.body.items[0];
            const finedustData = await (0, finedust_1.default)(stationName);
            return (0, beautifier_1.default)(finedustData);
        }
        case 'DefaultFinedust': {
            return '조금만 더 자세히 말씀해주시면 감사하겠습니다 ;)';
        }
        default:
            return '뭐라고 말씀하셨는지 다시 한번 더 정확히 말씀해주세요... ㅠ';
    }
};
exports.default = dustackle;
