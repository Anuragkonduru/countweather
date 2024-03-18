import { TestBed } from '@angular/core/testing';

import { ManageCountsService } from './manage-counts.service';

describe('ManageCountsService', () => {
  let service: ManageCountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
