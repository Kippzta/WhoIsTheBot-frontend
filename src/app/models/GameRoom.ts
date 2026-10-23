import { GameStatus } from "../types/GameStatus";
import { PlayerDTO } from "./PlayerDTO";

export interface GameRoomDTO {

    roomCode: string;

    gameStatus: GameStatus;

    players:  PlayerDTO[];

}