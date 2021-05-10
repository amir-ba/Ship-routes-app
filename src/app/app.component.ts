import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ships Routes Visualizer';
  /**
   * map view options
   */
  mapViewOptions = {
    center: [0,0],
    maxZoom: 14,
    zoom: 2
  }
}
