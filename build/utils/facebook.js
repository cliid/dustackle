"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const send = (senderPSID, payload) => {
    axios_1.default.post(`https://graph.facebook.com/v2.6/me/messages?${new URLSearchParams({
        access_token: process.env.FB_MESSENGER_ACCESS_TOKEN,
    })}`, {
        recipient: {
            id: senderPSID,
        },
        message: {
            text: payload,
        },
    });
};
exports.default = { send };
