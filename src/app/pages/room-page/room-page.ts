import { Component, inject, OnDestroy, OnInit} from '@angular/core';
import { ActivatedRoute, Router} from '@angular/router';
import { PlayerSessionService } from '../../services/player-session';
import { GameRoomSocketService } from '../../services/game-room-socket';

@Component({
  selector: 'app-room-page',
  imports: [],
  templateUrl: './room-page.html',
  styleUrl: './room-page.css',
})
export class RoomPage implements OnInit, OnDestroy{

  private activeRoute = inject(ActivatedRoute);

  private playerSessionService = inject(PlayerSessionService)

  private route = inject(Router)

  protected gameRoomSocketService = inject(GameRoomSocketService);

  protected gameRoom = this.gameRoomSocketService.gameRoom;

  ngOnInit(): void {
    
    const roomCode = this.activeRoute.snapshot.paramMap.get('roomCode');

    const playerId = this.playerSessionService.getPlayerId()

    if (roomCode === null || playerId === null) {

      this.route.navigate(['/'])
      return

    }

    this.gameRoomSocketService.connectToGameRoom(roomCode, playerId);

  }
 
  ngOnDestroy(): void {

    this.gameRoomSocketService.disconnect();

  }



}
