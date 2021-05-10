import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Route } from '../models/Route.class';
import { RoutesService } from '../services/routes.service';

@Component({
  selector: 'app-route-picker',
  templateUrl: './route-picker.component.html',
  styleUrls: ['./route-picker.component.css']
})
/**
 * Component housing the Route selector form field
 */
export class RoutePickerComponent  {
  shipRoutes: Observable<Array<Route>> = this.routesService.shipRoutes;
  selectedRoute: Observable<Route> = this.routesService.activeRoute
  routeSelector = new FormControl();

  constructor(private readonly routesService: RoutesService) {

  }
  /**
   * called on mat-option change. Sets the selected ship route
   * @param selectedRouteId Id for the selected Route
   */
  onRouteChange(selectedRouteId: number){
   this.routesService.selectRouteById(selectedRouteId);
  }
}
