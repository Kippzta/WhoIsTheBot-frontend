import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PlayerSessionService {

  private readonly playerSessionKey = 'playerId';

  private readonly playerUsernameKey = 'username';


  savePlayerId(playerId: string): void {

    sessionStorage.setItem(this.playerSessionKey, playerId);

  }

  getPlayerId(): string | null {

   return sessionStorage.getItem(this.playerSessionKey);

  }

  saveUsername(username: string): void {

    sessionStorage.setItem(this.playerUsernameKey, username);

  }

  getUsername(): string | null {

    return sessionStorage.getItem(this.playerUsernameKey);

  }

}
