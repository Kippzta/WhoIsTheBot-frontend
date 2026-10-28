import { ChatMessageRespDTO } from "../models/ChatMessageRespDTO";
import { GameRoomDTO } from "../models/GameRoom";
import { GameStatus } from "./GameStatus";

// Typer som tas emot från serversidan
export type ServerMessage =
    { type: 'ROOM_UPDATED'; data: GameRoomDTO }
    | { type: 'GAME_STATUS_CHANGED'; data: GameStatus }
    | { type: 'ALIAS_ASSIGNED'; data: string}
    | { type: 'CHAT_MESSAGE'; data: ChatMessageRespDTO}
    | { type: 'QUESTION_ASSIGNED'; data: string }
    | { type: 'VOTING_STARTED'; data: string[] }
    | { type: 'TIMER_STARTED'; data: number }
