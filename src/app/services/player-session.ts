import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerSessionService {

  private readonly playerSessionKey = 'playerId';


  savePlayerId(playerId: string): void {

    sessionStorage.setItem(this.playerSessionKey, playerId);

  }

  getPlayerId(): string | null {

   return sessionStorage.getItem(this.playerSessionKey);

  }


}
