import { Component, inject } from '@angular/core';
import { GameRoomSocketService } from '../../services/game-room-socket';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {

  private gameRoomSocketService = inject(GameRoomSocketService);

  protected gameResult = this.gameRoomSocketService.gameResult;

  protected myAlias = this.gameRoomSocketService.myAlias;

  

}
