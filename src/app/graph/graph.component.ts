import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { ECharts } from 'echarts';
import { Observable } from 'rxjs';
import { map} from 'rxjs/operators';
import { Route } from '../models/Route.class';
import { MapService } from '../services/map.service';
import { RoutesService } from '../services/routes.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
/**
 * component responsable for creating the line chart
 */
export class GraphComponent implements OnInit{
  /**
   * observable creating the Echart Options from the selected Ship Route
   */
  options!: Observable<EChartsOption>;
  /**
   * reference to the Echart gObject
   */
  echartsInstance!: ECharts;
  constructor(
    private readonly routesService: RoutesService,
    private readonly mapService: MapService) {
   }
   ngOnInit() {
     this.options = this.routesService.activeRoute.pipe(
       map((route: Route)=> ({
         title: {
           text:"Route speed Graph"
          },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          data: route.points.map((pnt) =>
            `${pnt.timestamp.toLocaleDateString()} ${pnt.timestamp.toLocaleTimeString()}`),
          axisLabel: {
           show: false
          }
      },
      yAxis: {
          type: 'value',
          name : 'speed in Knot',
          nameLocation: 'middle',
          nameTextStyle: {
            padding: 5
          }
      },
      grid: {
        right: 10,
      },
      series: [{
          data: route.points.map(point => point.speed ?? 0),
          type: 'line'
      }]
       } as EChartsOption))
     );
  }
  /**
   * sets the Echart Object on the component and adds the highlight event listners
   * @param ec EchartInstance comming from the Echart init Event
   */
  onChartInit(ec: ECharts) {
    this.echartsInstance = ec;
    this.echartsInstance.on("showTip",(ee: any)=>
        this.mapService.moveSpeedMarker(ee?.dataIndex));
    this.echartsInstance.on("hideTip",()=>
      this.mapService.moveSpeedMarker(undefined));
  }
}
