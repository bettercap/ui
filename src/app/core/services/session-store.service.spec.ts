import { TestBed } from '@angular/core/testing';

import { SessionStoreService } from './session-store.service';

describe('SessionStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SessionStoreService = TestBed.get(SessionStoreService);
    expect(service).toBeTruthy();
  });
});
