"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.webSocketService = void 0;
const rateLimiter_1 = require("../utils/helpers/rateLimiter");
class WebSocketService {
    constructor() {
        this.onlineUserCount = 0;
        this.connections = [];
    }
    static getInstance() {
        if (this._instance) {
            return this._instance;
        }
        this._instance = new WebSocketService();
        return this._instance;
    }
    addUser(input) {
        this.connections.push(input);
        this.onlineUserCount++;
        this.sendUserCountNotification();
    }
    removeUser(userId) {
        this.connections = this.connections.filter((connection) => connection.userId != userId);
        this.onlineUserCount = this.onlineUserCount - 1;
        (0, rateLimiter_1.removeUserFromCache)(userId);
        this.sendUserCountNotification();
    }
    sendUserCountNotification() {
        this.connections.forEach(({ ws }) => {
            ws.send(JSON.stringify({
                type: "user-count",
                payload: {
                    count: this.onlineUserCount,
                },
            }));
        });
    }
    sendUpdates(payload) {
        this.connections.forEach(({ ws }) => {
            ws.send(JSON.stringify({
                type: "update",
                payload: payload,
            }));
        });
    }
    sendErrorMessages(userId, message) {
        this.connections.forEach((connection) => {
            if (connection.userId === userId) {
                connection.ws.send(JSON.stringify({
                    type: "error",
                    message,
                }));
            }
        });
    }
    getCurrentUser() {
        return this.connections;
    }
}
exports.webSocketService = WebSocketService.getInstance();
