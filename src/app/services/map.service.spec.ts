import { TestBed } from '@angular/core/testing';
import { Map } from 'ol';
import VectorLayer from 'ol/layer/Vector';

import { MapService } from './map.service';
import { RoutesService } from './routes.service';
import { HttpClientModule } from '@angular/common/http';
describe('MapService', () => {
  let service: MapService;
  let routeService: RoutesService;

  let target = document.createElement('div');
  target.setAttribute('id','map');
  let map: Map;
  beforeEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [RoutesService]
    });
    service = TestBed.inject(MapService);
    routeService = TestBed.inject(RoutesService);
    map = service.createMap('map');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('#createMap should return a Openlayer map', () => {
    expect(map).toBeInstanceOf(Map);
  });
  it('#createVectorLayer should return a Openlayer Vector Layer', () => {
    let layer = service.createVectorLayer('test-layer');
    map.addLayer(layer);
    expect(map.getLayers().item(1)).toEqual(layer);
  });
  it('#createPathFeature should add the markers to the map', (done: DoneFn) => {
    let layer = service.createVectorLayer('test-layer');
    map.addLayer(layer);
    routeService.selectRouteById(1);
    routeService.activeRoute.subscribe(route=> {
      service.createPathFeature(route,'test-layer')
      expect(map.getLayers().item(1)).toBeInstanceOf(VectorLayer);
      let layer = map.getLayers().item(1) as VectorLayer;
      expect(layer.getSource().getFeatures()).toHaveSize(3);
      done();
    })
  });
});
