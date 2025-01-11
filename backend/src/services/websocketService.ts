import { removeUserFromCache } from "../utils/helpers/rateLimiter";
import { CustomWebSocket } from "../utils/types";



class WebSocketService {
  private static _instance: WebSocketService;
  private onlineUserCount: number = 0;

  private connections: { userId: number; ws: CustomWebSocket }[] = [];

  private constructor() {}

  public static getInstance() {
    if (this._instance) {
      return this._instance;
    }

    this._instance = new WebSocketService();
    return this._instance;
  }

  public addUser(input: { userId: number; ws: CustomWebSocket }) {
    this.connections.push(input);
    this.onlineUserCount++;
    this.sendUserCountNotification();
  }

  public removeUser(userId: number) {
    this.connections = this.connections.filter(
      (connection) => connection.userId != userId
    );
    this.onlineUserCount = this.onlineUserCount - 1;

    removeUserFromCache(userId);
    this.sendUserCountNotification();
  }

  public sendUserCountNotification() {
    this.connections.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: "user-count",
          payload: {
            count: this.onlineUserCount,
          },
        })
      );
    });
  }

  public sendUpdates(payload: any) {
    this.connections.forEach(({ ws }) => {
      ws.send(
        JSON.stringify({
          type: "update",
          payload: payload,
        })
      );
    });
  }

  public sendErrorMessages(userId: number, message: string) {
    this.connections.forEach((connection) => {
      if (connection.userId === userId) {
        connection.ws.send(
          JSON.stringify({
            type: "error",
            message,
          })
        );
      }
    });
  }

  public getCurrentUser() {
    return this.connections;
  }
}

export const webSocketService = WebSocketService.getInstance();
