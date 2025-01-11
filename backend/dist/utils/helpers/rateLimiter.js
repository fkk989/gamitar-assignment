"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RATE_LIMIT_WINDOW = void 0;
exports.rateLimiter = rateLimiter;
exports.removeUserFromCache = removeUserFromCache;
const rateLimitCache = {};
exports.RATE_LIMIT_WINDOW = 60 * 1000; // 60 seconds
function rateLimiter(userId) {
    const currentTime = Date.now();
    if (!rateLimitCache[userId]) {
        rateLimitCache[userId] = currentTime;
        return true;
    }
    const userData = rateLimitCache[userId];
    //blocking request when req come again under 1 second
    if (currentTime - userData < exports.RATE_LIMIT_WINDOW) {
        return false;
    }
    rateLimitCache[userId] = currentTime;
    return true;
}
function removeUserFromCache(userId) {
    delete rateLimitCache[userId];
}
// cleanup function to clean old request
setInterval(() => {
    const currentTime = Date.now();
    for (const userId in rateLimitCache) {
        if (currentTime - rateLimitCache[userId] > exports.RATE_LIMIT_WINDOW) {
            delete rateLimitCache[userId];
        }
    }
}, exports.RATE_LIMIT_WINDOW);
