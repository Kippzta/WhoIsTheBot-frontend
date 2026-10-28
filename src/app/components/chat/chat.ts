import { Component, inject } from '@angular/core';
import { GameRoomSocketService } from '../../services/game-room-socket';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [ReactiveFormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat {
  
  private gameRoomSocketService = inject(GameRoomSocketService)

  protected readonly MAX_TEXT_LENGTH = 150;

  protected chatMessages = this.gameRoomSocketService.chatMessages;

  protected myAlias = this.gameRoomSocketService.myAlias;

  protected starterQuestion = this.gameRoomSocketService.starterQuestion;

  protected roundTimer = this.gameRoomSocketService.roundSecondsLeft;

  chatRoomForm = new FormGroup({

    text: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.maxLength(this.MAX_TEXT_LENGTH)]})

  })

  onSendMessage(): void {

 if (this.chatRoomForm.invalid) {
    return
    }

    const chatMessage = this.chatRoomForm.getRawValue().text;
    
    const messageTrimmed = chatMessage.trim();

    if(!messageTrimmed) {
      return
    }

    this.gameRoomSocketService.sendChatMessage(messageTrimmed);

    this.chatRoomForm.reset();

  }

}
