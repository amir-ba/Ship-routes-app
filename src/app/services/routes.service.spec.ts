import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Route } from '../models/Route.class';

import { RoutesService } from './routes.service';

describe('RoutesService', () => {
  let service: RoutesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [RoutesService]
    });
    service = TestBed.inject(RoutesService);

  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#loadedRoutes should return the same CSV length', (done: DoneFn) => {
    service.shipRoutes.subscribe(value => {
      expect(value.length).toBe(38);
      expect(value.every(el => el instanceof Route)).toBe(true);
      done();
    });
  });
  it('#activeRoute should have selected Route', (done: DoneFn) => {
    let expected = [2,3,5];
    let index =0;
    service.selectRouteById(expected[index]);
    service.activeRoute.subscribe(route =>{
      expect(route.routeId).toEqual(expected[index++]);
      if(expected.length - 1 === index) {
        done();
      } else{
        service.selectRouteById(expected[index]);
      }
    });
  });
});
