import { WebSocketMessageType } from "./WebSocketMessageType";

export interface WebSocketMessageDTO<T> {

    type: WebSocketMessageType;

    data: T;

}