export type MessageType = "update" | "user-count" | "error"

export type Payload<T extends MessageType> = T extends "update" ? {
    row: number,
    col: number,
    char: any;
  } : T extends "user-count" ? {
    count:number
  } : {
    message:string
  }