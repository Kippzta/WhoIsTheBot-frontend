import { Component, computed, inject } from '@angular/core';
import { GameRoomSocketService } from '../../services/game-room-socket';
import { PlayerSessionService } from '../../services/player-session';

@Component({
  selector: 'app-lobby',
  imports: [],
  templateUrl: './lobby.html',
  styleUrl: './lobby.css',
})
export class Lobby {

  private readonly minReqPlayers = 2;
  
  private gameRoomSocketService = inject(GameRoomSocketService);

  private playerSessionService = inject(PlayerSessionService);

  protected gameRoom = this.gameRoomSocketService.gameRoom;

  private myUsername = this.playerSessionService.getUsername();

  protected isHost = computed(() => {

    const room = this.gameRoom();

    if (room === null) {

      return false;

    }

    const me = room.players.find(player => player.username === this.myUsername);

    return me ? me.isHost : false;

  });

  protected enoughPlayersToStartGame = computed(() => {

    const room = this.gameRoom();

    if(room === null) {
      return false;
    }

    return room.players.length >= this.minReqPlayers;

  });

  onStartGame(): void {

    this.gameRoomSocketService.startGame();

  }
}

