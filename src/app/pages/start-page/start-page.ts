import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameRoomService } from '../../services/game-room';
import { CreateRoomReqDTO } from '../../models/CreateRoomReqDTO';
import { PlayerSessionService } from '../../services/player-session';
import { JoinRoomReqDTO } from '../../models/JoinRoomReqDTO';
import { RoomEntryRespDTO } from '../../models/RoomEntryRespDTO';

@Component({
  selector: 'app-start-page',
  imports: [ReactiveFormsModule],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css',
})
export class StartPage {

  private readonly roomCodeLength = 5;

  private gameRoomService = inject(GameRoomService);

  private playerSessionService = inject(PlayerSessionService);

  private router = inject(Router);

  errorMsgCreate = signal('');

  errorMsgJoin = signal('');

  createRoomForm = new FormGroup({

    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] })

  })

  joinRoomForm = new FormGroup({

    username: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),

    roomCode: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(this.roomCodeLength), Validators.maxLength(this.roomCodeLength)] })

  })


  onSubmitCreateRoom() {

    if (this.createRoomForm.invalid) {

      this.errorMsgCreate.set("Användarnamn saknas!");
      return

    }

    const usernameInput = this.createRoomForm.getRawValue().username;

    const username = this.validateUsername(usernameInput);

    if (username === null) {
      this.errorMsgCreate.set('Användarnamnet får inte vara tomt!');
      return
    }

    const createRequest: CreateRoomReqDTO = { username: username }

    this.gameRoomService.createRoom(createRequest).subscribe({

      next: (roomEntryResponse) => {

        this.savePlayerAndNavigate(roomEntryResponse, username);

      },

      error: () => {

        this.errorMsgCreate.set('Något gick fel, försök igen')
        this.resetForm(this.createRoomForm);

      }
    });
  }

  onSubmitJoinRoom() {

    if (this.joinRoomForm.invalid) {
      this.errorMsgJoin.set("Användarnamn eller rumskod saknas, Försök igen");
      return
    }

    const usernameInput = this.joinRoomForm.getRawValue().username;

    const roomCodeInput = this.joinRoomForm.getRawValue().roomCode.trim().toUpperCase();

    const username = this.validateUsername(usernameInput);

    if (roomCodeInput.length !== this.roomCodeLength) {

      this.errorMsgJoin.set('Rumskoden måste vara exakt 5 tecken')
      return
    }

    if (username === null) {

      this.errorMsgJoin.set('Användarnamnet får inte vara tomt!')
      return

    }

    const joinRequest: JoinRoomReqDTO = { username: username, roomCode: roomCodeInput }

    this.gameRoomService.joinRoom(joinRequest).subscribe({

      next: (roomEntryResponse) => {
        this.savePlayerAndNavigate(roomEntryResponse, username);
      },
      error: () => {

        this.errorMsgJoin.set('Något gick fel, försök igen')
        this.resetForm(this.joinRoomForm);

      }

    });


  }


  private validateUsername(usernameInput: string): string | null {

    const username = usernameInput.trim();

    if (!username) {
      return null;
    }

    return username;

  }

  private resetForm(form: FormGroup): void {

    form.reset();

  }

  private savePlayerAndNavigate(roomEntryResponse: RoomEntryRespDTO, username: string): void {

    this.playerSessionService.savePlayerId(roomEntryResponse.playerId);
    this.playerSessionService.saveUsername(username);
    this.router.navigate(['/room', roomEntryResponse.gameRoomDTO.roomCode]);

  }

}
