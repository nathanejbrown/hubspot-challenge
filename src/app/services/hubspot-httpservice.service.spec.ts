import { TestBed } from '@angular/core/testing';

import { HubspotHttpservice } from './hubspot-httpservice.service';

describe('HubspotHttpservice', () => {
  let service: HubspotHttpservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HubspotHttpservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
