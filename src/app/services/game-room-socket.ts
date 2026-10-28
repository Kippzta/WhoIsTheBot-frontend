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

  //https://developer.mozilla.org/en-US/docs/Web/API/Window/setInterval
  // detta är själva timerns id, eftersom flera timers kan vara igång samtidigt så måste 
  // vi veta vilken det är för att kunna stoppa den.
  //null betyder att ingen nedräkning körs.
  private countDownId: number | null = null;

  // signal som inneåhller och visar startfrågan när spelet har startat
  starterQuestion = signal<string | null>(null);

  // signal som inhåller alla chattmeddelanden med tillhörande alias
  chatMessages = signal<ChatMessageRespDTO[]>([]);

  //signal för att kunna uppdatera komponenters vy när gameRoom ändras
  gameRoom = signal<GameRoomDTO | null>(null);

  //signal för att uppdatera och visa varje spelares egena alias 
  myAlias = signal<string | null>(null);

  //signal som visar hur många sekunder det är kvar på rundan
  roundSecondsLeft = signal<number | null>(null);


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

          // OM mesage är av typen TIMER_STARTED starta nedräkningen med det antal sekunder som kommer från servern
          case 'TIMER_STARTED':
            this.startCountDown(serverMessage.data);
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

      this.roundSecondsLeft.set(null);

      this.stopCountDown();
    }

  }

  startGame(): void {

    const message: WebSocketMessageDTO<null> = { type: 'START_GAME', data: null };

    const messageText = JSON.stringify(message);

    this.socket?.send(messageText);

  }


  // Skapar och skickar meddelandet till backend som ska innehålle typen CHAT_MESSAGE och en text som är meddelandet använadren skrev
  sendChatMessage(text: string): void {

    const chatMessage: WebSocketMessageDTO<string> = { type: 'CHAT_MESSAGE', data: text };

    const chatMessageText = JSON.stringify(chatMessage);

    this.socket?.send(chatMessageText);

  }

  // Startar timern för chatten
  startCountDown(seconds: number): void {

    // metoden kontrollerar om det finns en timer isåfall stoppa den,
    // detta så inte fler ska kunna starta flera timers samtidigt
     this.stopCountDown();
    

    // skickar in hur många sekunder timern ska ha att räkna ner ifrån
    this.roundSecondsLeft.set(seconds);


    // Här skapas timern och sparas i Id:t med en siffra
    // Varje sekund uppdateras roundSecondsLeft signalen med -1 tills den blir 0
    this.countDownId = setInterval(() => {

      this.roundSecondsLeft.update(oldSeconds => oldSeconds ?
        oldSeconds - 1 : null
      );
      // Variabel att jämföra med då man inte kan jämföra med null genom att anropa signalens värde
      const secondsLeft = this.roundSecondsLeft();

      // OM tiden på timern inte är null och är mindre än eller lika med 0 stoppa timern och skicka till backend att den stoppats.
      if (secondsLeft !== null && secondsLeft <= 0) {
        this.stopCountDown();
        this.sendChatTimeEnd();
      }
    }, 1000);


  }

  // OM det finns en countDown stoppa den och sätt timern till null;
  private stopCountDown(): void {

    if(this.countDownId !== null) {
      clearInterval(this.countDownId);
      this.countDownId = null;
    }
  }

    private sendChatTimeEnd(): void {
      const stopTimeMessage: WebSocketMessageDTO<null> = { type: 'CHAT_TIME_END', data: null}
      this.socket?.send(JSON.stringify(stopTimeMessage));
    }

}

