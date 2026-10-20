import { TestBed } from '@angular/core/testing';

import { GameRoomSocket } from './game-room-socket';

describe('GameRoomSocket', () => {
  let service: GameRoomSocket;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameRoomSocket);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
