import { TestBed } from '@angular/core/testing';

import { GameRoom } from './game-room';

describe('GameRoom', () => {
  let service: GameRoom;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameRoom);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
