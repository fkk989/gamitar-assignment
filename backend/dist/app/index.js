"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const ws_1 = require("ws");
const websocketService_1 = require("../services/websocketService");
const rateLimiter_1 = require("../utils/helpers/rateLimiter");
const schema_1 = require("../utils/schema");
const matrixHelper_1 = require("../utils/helpers/matrixHelper");
const routes_1 = require("../routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)(), express_1.default.json());
// matrix routes to get current context and history of matrix
app.use("/matrix", routes_1.matrixRouter);
const httpServer = http_1.default.createServer(app);
const wss = new ws_1.WebSocketServer({ server: httpServer });
// storing a global userId and increment on each connection
let globalUserId = 1;
wss.on("connection", (ws, req) => {
    // adding user and the websocket connection
    websocketService_1.webSocketService.addUser({ userId: globalUserId, ws });
    ws.userId = globalUserId;
    globalUserId = globalUserId + 1;
    //handling user updates
    ws.on("message", (message) => {
        const currenttime = Date.now();
        if (!(0, rateLimiter_1.rateLimiter)(ws.userId)) {
            websocketService_1.webSocketService.sendErrorMessages(ws.userId, "Please wait before sending next request");
            return;
        }
        if (!message.toString()) {
            websocketService_1.webSocketService.sendErrorMessages(ws.userId, "Invalid input");
            return;
        }
        const messageBody = JSON.parse(message.toString());
        const parsedMessage = schema_1.messageSchmea.safeParse(messageBody);
        if (!parsedMessage.success) {
            websocketService_1.webSocketService.sendErrorMessages(ws.userId, "Input validation failed");
            return;
        }
        (0, matrixHelper_1.addGridHistory)(currenttime, parsedMessage.data.payload);
        websocketService_1.webSocketService.sendUpdates(parsedMessage.data.payload);
    });
    //   removing user whenever the connection closes
    ws.on("close", () => {
        const userId = ws.userId;
        websocketService_1.webSocketService.removeUser(userId);
        //
        const userLeft = websocketService_1.webSocketService.getCurrentUser();
        if (userLeft.length == 0) {
            (0, matrixHelper_1.resetGridHistory)();
            globalUserId = 0;
        }
    });
});
app.get("/health", (req, res) => {
    res.json({
        success: true,
        message: `server running fine`,
    });
});
exports.default = httpServer;
