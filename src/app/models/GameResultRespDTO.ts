import { PlayerResultRespDTO } from "./PlayerResultRespDTO";

export interface GameResultRespDTO {

    botAlias: string;

    playerResultRespDTO: PlayerResultRespDTO[];

}