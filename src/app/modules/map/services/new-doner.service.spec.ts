import { TestBed } from '@angular/core/testing';

import { NewDonerService } from './new-doner.service';

describe('NewDonerService', () => {
  let service: NewDonerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewDonerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
