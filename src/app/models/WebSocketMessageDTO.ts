import { WebSocketMessageType } from "../types/WebSocketMessageType";

export interface WebSocketMessageDTO<T> {

    type: WebSocketMessageType;

    data: T;

}