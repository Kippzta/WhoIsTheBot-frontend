import { Injectable, signal } from '@angular/core';
import { GameRoomDTO } from '../models/GameRoom';
import { env } from '../../environments/environment';
import { WebSocketMessageDTO } from '../models/WebSocketMessageDTO';
import { ServerMessage } from '../types/ServerMessage';
import { ChatMessageRespDTO } from '../models/ChatMessageRespDTO';

@Injectable({
  providedIn: 'root',
})
export class GameRoomSocketService {

  private socket: WebSocket | null = null;

  // signal som inneåhller och visar startfrågan när spelet har startat
  starterQuestion = signal<string | null>(null);

  // signal som inhåller alla chattmeddelanden med tillhörande alias
  chatMessages = signal<ChatMessageRespDTO[]>([]);

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
      const serverMessage: ServerMessage = JSON.parse(event.data);


      switch (serverMessage.type) {

        // OM message är av typen ROOM_UPDATED, uppdatera gameRoom signalen med den nya datan
        case 'ROOM_UPDATED':
          this.gameRoom.set(serverMessage.data);
          break;

        //OM message är av typen GAME_STATUS_CHANGED, uppdatera gameRoom signalen med den nya gameStatus från servern
        case 'GAME_STATUS_CHANGED':
          this.gameRoom.update(oldGameRoom => (oldGameRoom) ? {
            ...oldGameRoom, gameStatus: serverMessage.data
          } : null);
          break;

          //OM messaage är av typen ALIAS_ASSIGNED, uppdaterar spelarens egna alias som kommer från backenden
        case 'ALIAS_ASSIGNED':
          this.myAlias.set(serverMessage.data);
          break;

          //OM message är av typen CHAT_MESSAGE uppdatera meddelande listan med det nya meddelandet sist.
          case 'CHAT_MESSAGE':
            this.chatMessages.update(oldMessages =>
              [...oldMessages, serverMessage.data]);
              break;

              //OM message är av typen QUESTION_ASSIGNED uppdatera startfrågan med värdet från servern
              case 'QUESTION_ASSIGNED':
                this.starterQuestion.set(serverMessage.data);
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

      this.chatMessages.set([]);

      this.starterQuestion.set(null);
    }

  }

  startGame(): void {

    const message: WebSocketMessageDTO<null> = { type: 'START_GAME', data: null };

    const messageText = JSON.stringify(message);

    this.socket?.send(messageText);

  }


  // Skapar och skickar meddelandet till backend som ska innehålle typen CHAT_MESSAGE och en text som är meddelandet använadren skrev
  sendChatMessage(text: string): void{

    const chatMessage: WebSocketMessageDTO<string> = { type: 'CHAT_MESSAGE', data: text};

    const chatMessageText = JSON.stringify(chatMessage);

    this.socket?.send(chatMessageText);
    
  }

}
