"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session_1 = require("./session");
async function dialogflow(query, languageCode, contexts) {
    console.log(`DIALOGFLOW --- Query: ${query}`);
    // The path to identify the agent that owns the created intent.
    const sessionPath = session_1.sessionClient.projectAgentSessionPath(process.env.DIALOGFLOW_PROJECT_ID, session_1.sessionId);
    // The text query request.
    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: query,
                languageCode,
            },
        },
    };
    if (contexts && contexts.length > 0) {
        request = {
            ...request,
            queryParams: {
                contexts,
            },
        };
    }
    const responses = await session_1.sessionClient.detectIntent(request);
    return responses[0];
}
exports.default = dialogflow;
