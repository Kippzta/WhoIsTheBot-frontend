import { Injectable, signal } from '@angular/core';
import { GameRoomDTO } from '../models/GameRoom';
import { env } from '../../environments/environment';
import { WebSocketMessageDTO } from '../models/WebSocketMessageDTO';
import { ServerMessage } from '../types/ServerMessage';

@Injectable({
  providedIn: 'root',
})
export class GameRoomSocketService {

  private socket: WebSocket | null = null;

  //signal för att kunna uppdatera komponenters vy när gameRoom ändras
  gameRoom = signal<GameRoomDTO | null>(null);

  //signal för att uppdatera och visa varje spelares egena alias 
  myAlias = signal<string | null>(null);

  // ansluter till websocket servern
  // källa: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  connectToGameRoom(roomCode: string, playerId: string): void {

    this.socket = new WebSocket(`${env.wsUrl}/rooms/${roomCode}/${playerId}`);
    this.socket.onmessage = (event) => {

      // tar emot och parsar meddelandet från servern
      const message: ServerMessage = JSON.parse(event.data);


      switch (message.type) {

        // OM message är av typen ROOM_UPDATED, uppdatera gameRoom signalen med den nya datan
        case 'ROOM_UPDATED':
          this.gameRoom.set(message.data);
          break;

        //OM message är av typen GAME_STATUS_CHANGED, uppdatera gameRoom signalen med den nya gameStatus från servern
        case 'GAME_STATUS_CHANGED':
          this.gameRoom.update(oldGameRoom => (oldGameRoom) ? {
            ...oldGameRoom, gameStatus: message.data
          } : null);
          break;

          //OM messaage är av typen ALIAS_ASSIGNED, uppdaterar spelarens egna alias som kommer från backenden
        case 'ALIAS_ASSIGNED':
          this.myAlias.set(message.data);
          break;
      }
    };
  }

  disconnect(): void {

    if (this.socket !== null) {

      this.socket.close();

      this.socket = null;

      this.gameRoom.set(null);

      this.myAlias.set(null);
    }

  }

  startGame(): void {

    const message: WebSocketMessageDTO<null> = { type: 'START_GAME', data: null };

    const messageText = JSON.stringify(message);

    this.socket?.send(messageText);

  }

}
