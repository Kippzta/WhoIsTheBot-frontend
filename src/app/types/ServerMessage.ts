import { GameRoomDTO } from "../models/GameRoom";
import { GameStatus } from "./GameStatus";

export type ServerMessage =
    { type: 'ROOM_UPDATED'; data: GameRoomDTO }
    | { type: 'GAME_STATUS_CHANGED'; data: GameStatus }
