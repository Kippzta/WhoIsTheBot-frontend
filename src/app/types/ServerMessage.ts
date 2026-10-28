import { ChatMessageRespDTO } from "../models/ChatMessageRespDTO";
import { GameResultRespDTO } from "../models/GameResultRespDTO";
import { GameRoomDTO } from "../models/GameRoom";
import { GameStatus } from "./GameStatus";

// Typer som tas emot från serversidan
export type ServerMessage =
    { type: 'ROOM_UPDATED'; data: GameRoomDTO }
    | { type: 'GAME_STATUS_CHANGED'; data: GameStatus }
    | { type: 'ALIAS_ASSIGNED'; data: string}
    | { type: 'QUESTION_ASSIGNED'; data: string }
    | { type: 'CHAT_MESSAGE'; data: ChatMessageRespDTO}
    | { type: 'TIMER_STARTED'; data: number }
    | { type: 'VOTING_STARTED'; data: string[] }
    | { type: 'GAME_RESULT'; data: GameResultRespDTO}
