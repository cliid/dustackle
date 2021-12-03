"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dialogflow_1 = __importDefault(require("./dialogflow"));
const nlp = async (text) => {
    const response = await (0, dialogflow_1.default)(text, 'ko-KR');
    console.log('NLP --- Detected intent');
    const result = response.queryResult;
    console.log(`NLP ---   Query: ${result.queryText}`);
    console.log(`NLP ---   Response: ${result.fulfillmentText}`);
    if (result.intent) {
        console.log(`NLP ---   Intent: ${result.intent.displayName}`);
    }
    else {
        console.log('NLP ---   No intent matched.');
    }
    return result;
};
exports.default = nlp;
