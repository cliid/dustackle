"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dustackle_1 = __importDefault(require("../utils/dustackle"));
const finedust_1 = __importDefault(require("../utils/finedust"));
const nlp_1 = __importDefault(require("../utils/nlp"));
const facebook_1 = __importDefault(require("../utils/facebook"));
const APIRoute = async (server) => {
    server.post('/finedust', {}, async (req, res) => {
        try {
            res.code(200).send(await (0, finedust_1.default)(req.body.stationName));
        }
        catch (error) {
            req.log.error(`API --- ${error}`);
            res.send(500);
        }
    });
    server.post('/nlp', {}, async (req, res) => {
        try {
            res.code(200).send(await (0, nlp_1.default)(req.body.text));
        }
        catch (error) {
            req.log.error(`API --- ${error}`);
            res.send(500);
        }
    });
    // Facebook Messenger Webhook
    server.post('/webhook', {}, async (req, res) => {
        try {
            if (req.body.object === 'page') {
                // Iterates over each entry - there may be multiple if batched
                req.body.entry.forEach((entry) => {
                    // Gets the message. entry.messaging is an array, but
                    // will only ever contain one message, so we get index 0
                    const webhookEvent = entry.messaging[0];
                    console.log(webhookEvent);
                });
                // Returns a '200 OK' response to all requests
                res.code(200).send('EVENT_RECEIVED');
                return;
            }
            // If it's not from a page, and rather directly from the messenger...
            const senderID = req.body.sender.id;
            const message = req.body.message.text;
            console.log(`API --- Message: ${message}, from User: ${senderID}`);
            const response = await (0, dustackle_1.default)(message);
            facebook_1.default.send(senderID, response);
            res.code(200).send(response);
        }
        catch (error) {
            req.log.error(`API --- ${error}`);
            res.send(500);
        }
    });
    server.get('/webhook', {}, async (req, res) => {
        try {
            // Your verify token. Should be a random string.
            const VERIFY_TOKEN = process.env.FB_WEBHOOK_VERIFY_TOKEN;
            // Parse the query params
            const mode = req.query['hub.mode'];
            const token = req.query['hub.verify_token'];
            const challenge = req.query['hub.challenge'];
            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
                // Checks the mode and token sent is correct
                if (mode === 'subscribe' && token === VERIFY_TOKEN) {
                    // Responds with the challenge token from the request
                    console.log('API --- WEBHOOK_VERIFIED');
                    res.code(200).send(challenge);
                }
                else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    res.send(403);
                }
            }
        }
        catch (error) {
            req.log.error(`API --- ${error}`);
            res.send(500);
        }
    });
};
exports.default = APIRoute;
