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

  protected readonly MAX_TEXT_LENGTH = 150;

  private gameRoomSocketService = inject(GameRoomSocketService)

  protected chatMessages = this.gameRoomSocketService.chatMessages;

  protected myAlias = this.gameRoomSocketService.myAlias;

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
