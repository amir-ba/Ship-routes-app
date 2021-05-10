import { Injectable } from '@angular/core';
import { Feature, Map, MapBrowserEvent } from 'ol';
import LineString from 'ol/geom/LineString';
import Point from 'ol/geom/Point';
import BaseLayer from 'ol/layer/Base';
import Layer from 'ol/layer/Layer';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style, { StyleFunction, StyleLike } from 'ol/style/Style';
import Circle from 'ol/style/Circle';
import View, { ViewOptions } from 'ol/View';
import { Route } from '../models/Route.class';

@Injectable({
  providedIn: 'root'
})
/**
 * service that provides needed functionality for the Openlayers map instance
 */
export class MapService {
  /**
   * the Openlayers global map instance
   */
  olMap!: Map;
  constructor() { }
  /**
   * creates the initial Map Object
   * @param target Div element for the Map instance
   * @param viewOptions OL view Options
   * @param initialLayers Layers
   * @returns the OL map object
   */
  createMap(target: string,
    viewOptions?: ViewOptions, initialLayers: Array<Layer> = []): Map {
    this.olMap = new Map({
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        ...initialLayers],
      target,
      view: new View(viewOptions)
    });

    return this.olMap;
  }
  /**
   * returns a based on the given name from the map
   * @param name layer name
   * @returns Layer instance
   */
  getLayerByName(name: string): BaseLayer | undefined {
    return this.olMap.getLayers().getArray().find(lyr => lyr.get('name') === name);
  }
  /**
   * creates a vector layer with the provided setting
   * @param name new Layers name
   * @returns the Layer instance
   */
  createVectorLayer(name: string): VectorLayer {
    const source = new VectorSource({
      wrapX: false
    });
    const vectorLayer = new VectorLayer({
      source,
      style: this.pathStyleFunction.bind(this) as StyleFunction
    });
    vectorLayer.set('name', name);
    return vectorLayer;
  }
  /**
   * creates the Ship Route Feature instance based on the Route Data
   * @param route the Route Object
   * @param layerName layer to place the created feature
   */
  createPathFeature(route: Route, layerName: string): void {
    const line = new LineString(route.points.map(point => ([point.longitude, point.latitude])));
    line.transform('EPSG:4326', 'EPSG:3857');

    var startMarker = new Feature({
      type: 'start',
      name: route.routeOrigin,

      geometry: new Point(line.getCoordinateAt(0)),
    });
    var endMarker = new Feature({
      type: 'end',
      name: route.routeTarget,
      geometry: new Point(line.getCoordinateAt(1)),
    });
    const sourceLayer = this.getLayerByName(layerName);
    const lineFeature = new Feature({
      type: 'route',
      id: route.routeId,
      route: route,
      geometry: line
    });
    if (sourceLayer instanceof VectorLayer) {
      sourceLayer.getSource().clear();
      sourceLayer.getSource().set('route',route);
      sourceLayer.getSource().addFeatures([startMarker, endMarker, lineFeature]);
      this.olMap.getView().fit(line, { maxZoom: 17, duration: 100 });
    }
  }
  /**
   * assigns a color to the speed value
   * @param speed number value of the speed
   * @returns Hex color
   */
  assignColorFromSpeed(speed: number | undefined) : string {
    if (!speed) {
      return '#f7f7f7';
    }
    switch (true) {
      case (speed  <= 14):
        return '#1a9641';
      case (speed  > 14 && speed < 18):
        return '#fdae61';
      case speed >=18:
        return '#d7191c';
      default:
        return '#f7f7f7';

    }
  }
  /**
   * creates/updates the marker indicating the Charts highlighted position on the map
   * @param index index of the GPS Point
   * @param layerName layer to include the generated feature
   */
  moveSpeedMarker(index?: number, layerName: string = 'selection-layer') : void{
    const featureLayer = this.getLayerByName(layerName);
    if (!(featureLayer instanceof VectorLayer)) {
      return;
    }
    const route: Route = featureLayer.getSource().get('route');
    const pointCoords = route.getPointAtIndex(index);
    let speedMarker = featureLayer.getSource()?.getFeatureById('speedMarker');
    if (!speedMarker) {
      speedMarker= new Feature({
        type: 'speedMarker'
      });
      speedMarker.setId('speedMarker');
      featureLayer.getSource()?.addFeature(speedMarker);
    }
    if (pointCoords) {
      const currentPoint = new Point([pointCoords.longitude, pointCoords.latitude])
        .transform('EPSG:4326', 'EPSG:3857');
      speedMarker.setGeometry(currentPoint)
    } else {
      featureLayer.getSource()?.removeFeature(speedMarker);
    }
  }
  pathStyleFunction(feature: Feature): StyleLike{
    const styles: Array<Style> = []
    switch(feature.get('type')) {
      case 'start':
      case 'end' :
        styles.push(new Style({
           image: new Circle({
             stroke: new Stroke({
               color: "rgba(255,255,255, 1)",
               width: 1
             }),
             fill: new Fill({ color: "rgba(37,52,148, 0.6)" }),
             radius:5
           })
         }));
         break;
      case 'speedMarker':
      styles.push(new Style({
        image: new Circle({
          stroke: new Stroke({
            color: "rgba(255,255,255, 1)",
            width: 1
          }),
          fill: new Fill({ color: "rgba(37,52,148, 0.6)" }),
          radius: 10
        })
      }));
      break;
      case 'route':
        const geometry = feature.getGeometry() as LineString;
        let segment = 0;
        let previousColor:string;
        let lineSegment: LineString;
        geometry?.forEachSegment((start, end)=>{
          const featureRoute: Route = feature.get('route');
          const pointSpeed = featureRoute.getPointAtIndex(segment)?.speed;
          const color = this.assignColorFromSpeed(pointSpeed);
          if (color !== previousColor) {
            previousColor = color;
            lineSegment = new LineString([start,end]);
            styles.push(new Style({
              geometry: lineSegment,
              stroke: new Stroke({
                color: color,
                width: 3
              })
            }));
          } else {
            lineSegment.appendCoordinate(end);
          }
          segment++
        });
        break;
      default:
        styles.push(new Style());
        break;
    }
    return styles;
  }
}
