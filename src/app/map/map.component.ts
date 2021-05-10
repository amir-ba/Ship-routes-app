import { Component, Input, AfterViewInit } from '@angular/core';
import { ViewOptions } from 'ol/View';
import { MapService } from '../services/map.service';
import { Route } from '../models/Route.class';
import { RoutesService } from '../services/routes.service';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
/**
 * component that creates the Openlayer map Instance and the Vector Layers
 */
export class MapComponent implements AfterViewInit {
  /**
   * View Option neccessary for creating the Openlayer instnace
   */
  @Input() viewOptions: ViewOptions | undefined;
  constructor(private readonly mapService: MapService,
              private readonly routesService: RoutesService) {

   }
  ngOnInit(): void{
    this.routesService.activeRoute
    .subscribe((route: Route) => this.mapService.createPathFeature(route,'selection-layer'));
  }
  ngAfterViewInit(): void {
    const pathVectorLayer = this.mapService.createVectorLayer('selection-layer');
    this.mapService.createMap('map', this.viewOptions, [pathVectorLayer]);
  }

}
