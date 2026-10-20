import { Injectable, signal } from '@angular/core';
import { GameRoomDTO } from '../models/GameRoom';
import { env } from '../../environments/environment';
import { WebSocketMessageDTO } from '../models/WebSocketMessageDTO';

@Injectable({
  providedIn: 'root',
})
export class GameRoomSocketService {

  private socket: WebSocket | null = null;

  //signal för att kunna uppdatera komponenter när gameRoom ändras
  gameRoom = signal<GameRoomDTO | null>(null);

  // ansluter till websocket servern
  // källa: https://developer.mozilla.org/en-US/docs/Web/API/WebSocket
  connectToGameRoom(roomCode: string, playerId: string): void {

    this.socket = new WebSocket(`${env.wsUrl}/rooms/${roomCode}/${playerId}`);
    this.socket.onmessage = (event) => {

      // tar emot och parsar meddelandet från servern
      const message: WebSocketMessageDTO<GameRoomDTO> = JSON.parse(event.data);

      //OM meddelandet är av typen ROOM_UPDATED, uppdatera gameRoom signalen med den nya datan
      if (message.type === 'ROOM_UPDATED') {
        
        this.gameRoom.set(message.data);

      }
    };
  }

  
  disconnect(): void {

    if(this.socket !== null) {

      this.socket.close();

      this.socket = null;

      this.gameRoom.set(null);
    }

  }

}
