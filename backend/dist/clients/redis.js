"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRedisClient = createRedisClient;
const ioredis_1 = require("ioredis");
const host = process.env.REDIS_HOST || "localhost";
const port = parseInt(process.env.REDIS_PORT) || 6379;
const username = process.env.REDIS_USERNAME || "default";
const password = process.env.REDIS_PASSWORD || "";
//
function createRedisClient() {
    if (password) {
        const client = new ioredis_1.Redis({
            host,
            port,
            username,
            // password is only required when you use a hosted redis
            password,
        });
        return client;
    }
    //
    const client = new ioredis_1.Redis({
        host,
        port,
        username,
    });
    return client;
}
