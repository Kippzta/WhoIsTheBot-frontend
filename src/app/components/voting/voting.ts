import { Component, computed, inject, signal } from '@angular/core';
import { GameRoomSocketService } from '../../services/game-room-socket';

@Component({
  selector: 'app-voting',
  imports: [],
  templateUrl: './voting.html',
  styleUrl: './voting.css',
})
export class Voting {

  private gameRoomSocketService = inject(GameRoomSocketService);

  protected aliasesToVoteFor = this.gameRoomSocketService.aliasesToVoteFor;

  protected myAlias = this.gameRoomSocketService.myAlias;

  //signal som innehåller spelarens egna röst
  protected myVote = signal<string | null>(null);


// computed signal som uppdateras när myAlias eller aliaesesToVoteFor ändras 
// och innehåller alla alias förutom seplarens egna
  protected voteableAliases = computed(() => {
    const myAlias = this.myAlias();
    return this.aliasesToVoteFor().filter(alias => alias !== myAlias);
  });

  //När spelaren klickar på Rösta, 
  protected onVote(alias:string): void {

    //Om den redan röstat avbryt
    if(this.myVote() !== null) {
      return;
    } 

    //annars skicka rösten till servern, sen spara värdet i myVote
    // vilket gör att spelare bar akan rösta en gång
    this.gameRoomSocketService.sendVote(alias);
    this.myVote.set(alias);

  }

}
