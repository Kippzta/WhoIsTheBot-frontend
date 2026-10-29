import { Component, inject } from '@angular/core';
import { GameRoomSocketService } from '../../services/game-room-socket';
import { Router } from '@angular/router';

@Component({
  selector: 'app-result',
  imports: [],
  templateUrl: './result.html',
  styleUrl: './result.css',
})
export class Result {

  private router = inject(Router)

  private gameRoomSocketService = inject(GameRoomSocketService);

  protected gameResult = this.gameRoomSocketService.gameResult;

  protected myAlias = this.gameRoomSocketService.myAlias;

  protected onPlayAgain() {
    this.router.navigate(['/']);
  }

}
