import WebSocket from "ws";


export type Payload = {
  row: number,
  col: number,
  char: any;
} 

export interface CustomWebSocket extends WebSocket {
  userId: number;
}
