import { TestBed } from '@angular/core/testing';

import { GetDonersDataService } from './get-doners-data.service';

describe('GetDonersDataService', () => {
  let service: GetDonersDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetDonersDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
