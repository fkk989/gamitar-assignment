import express from "express";
import cors from "cors";
import https from "http";
import { WebSocketServer } from "ws";
import { webSocketService } from "../services/websocketService";
import { CustomWebSocket } from "../utils/types";
import { rateLimiter } from "../utils/helpers/rateLimiter";
import { messageSchmea } from "../utils/schema";
import {
  addGridHistory,
  resetGridHistory,
} from "../utils/helpers/matrixHelper";
import { matrixRouter } from "../routes";

const app = express();

app.use(cors(), express.json());

// matrix routes to get current context and history of matrix
app.use("/api/matrix", matrixRouter);

const httpServer = https.createServer(app);

const wss = new WebSocketServer({ server: httpServer });

// storing a global userId and increment on each connection
let globalUserId = 1;

wss.on("connection", (ws: CustomWebSocket, req) => {
  // adding user and the websocket connection
  webSocketService.addUser({ userId: globalUserId, ws });
  ws.userId = globalUserId;

  globalUserId = globalUserId + 1;

  //handling user updates
  ws.on("message", (message) => {
    const currenttime = Date.now();

    if (!rateLimiter(ws.userId)) {
      webSocketService.sendErrorMessages(
        ws.userId,
        "Please wait before sending next request"
      );
      return;
    }

    if (!message.toString()) {
      webSocketService.sendErrorMessages(ws.userId, "Invalid input");
      return;
    }

    const messageBody = JSON.parse(message.toString());

    const parsedMessage = messageSchmea.safeParse(messageBody);

    if (!parsedMessage.success) {
      webSocketService.sendErrorMessages(ws.userId, "Input validation failed");
      return;
    }

    addGridHistory(currenttime, parsedMessage.data.payload);

    webSocketService.sendUpdates(parsedMessage.data.payload);
  });

  //   removing user whenever the connection closes
  ws.on("close", () => {
    const userId = ws.userId;
    webSocketService.removeUser(userId);
    //
    const userLeft = webSocketService.getCurrentUser();
    if (userLeft.length == 0) {
      resetGridHistory();
      globalUserId = 0;
    }
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: `server running fine`,
  });
});

export default httpServer;
