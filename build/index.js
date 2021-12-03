"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const fastify_env_1 = require("fastify-env");
const pino_1 = __importDefault(require("pino"));
const fastify = (0, fastify_1.default)({
    logger: (0, pino_1.default)({ level: 'info' }),
});
const schema = {
    type: 'object',
    required: [
        'FB_MESSENGER_ACCESS_TOKEN',
        'FB_WEBHOOK_VERIFY_TOKEN',
        'DIALOGFLOW_PROJECT_ID',
        'DIALOGFLOW_CREDENTIALS',
        'VWORLD_ACCESS_TOKEN',
        'AIRKOREA_API_SERVICE_KEY',
    ],
    properties: {
        FB_MESSENGER_ACCESS_TOKEN: {
            type: 'string',
            default: '',
        },
        FB_WEBHOOK_VERIFY_TOKEN: {
            type: 'string',
            default: '',
        },
        DIALOGFLOW_PROJECT_ID: {
            type: 'string',
            default: '',
        },
        DIALOGFLOW_CREDENTIALS: {
            type: 'string',
            default: '',
        },
        VWORLD_ACCESS_TOKEN: {
            type: 'string',
            default: '',
        },
        AIRKOREA_API_SERVICE_KEY: {
            type: 'string',
            default: '',
        },
    },
};
const options = {
    dotenv: true,
    data: process.env,
    schema,
    confKey: 'config',
};
// register plugin below:
const initialize = async () => {
    fastify.register(fastify_env_1.fastifyEnv, options);
    await fastify.after();
    fastify.register(Promise.resolve().then(() => __importStar(require('./routes/api'))), { prefix: '/api' });
    fastify.register(Promise.resolve().then(() => __importStar(require('./routes/static'))));
};
initialize();
// Fire up the server
(async () => {
    try {
        await fastify.ready();
        await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
    }
    catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
})();
