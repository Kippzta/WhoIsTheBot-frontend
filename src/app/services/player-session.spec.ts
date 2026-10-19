import { TestBed } from '@angular/core/testing';

import { PlayerSessionService } from './player-session';

describe('PlayerSession', () => {
  let service: PlayerSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
