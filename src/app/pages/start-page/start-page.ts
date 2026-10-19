import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameRoomService } from '../../services/game-room';
import { CreateRoomReqDTO } from '../../models/CreateRoomReqDTO';
import { PlayerSessionService } from '../../services/player-session';

@Component({
  selector: 'app-start-page',
  imports: [ReactiveFormsModule],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css',
})
export class StartPage {

  private gameRoomService = inject(GameRoomService);

  private playerSessionService = inject(PlayerSessionService);

  private router = inject(Router);

  errorMsg = signal('');

  createRoomForm = new FormGroup({

    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })

  })

  onSubmitCreateRoom() {

    if (this.createRoomForm.invalid) {

      this.errorMsg.set("Användarnamn saknas!");
      return

    }

    const usernameInput = this.createRoomForm.getRawValue().username.trim();

    if (!usernameInput) {
      this.errorMsg.set('Användarnamnet får inte vara tomt!');
      return
    }

    const request: CreateRoomReqDTO = { username: usernameInput }

    this.gameRoomService.createRoom(request).subscribe({

      next: (roomEntryResponse) => {

        console.log(roomEntryResponse);
        this.playerSessionService.savePlayerId(roomEntryResponse.playerId);
        this.router.navigate(['/room', roomEntryResponse.gameRoomDTO.roomCode])

      },

      error: () => {

        this.errorMsg.set('Något gick fel, försök igen')
        this.resetForm();

      }
    });
  }



  resetForm() {

    this.createRoomForm.reset();

  }





}
