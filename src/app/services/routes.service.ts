import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { catchError, map, tap } from 'rxjs/operators';
import { Route } from '../models/Route.class';
import { Observable, Subject } from 'rxjs';
import { Point } from '../models/Point.class';
@Injectable({
  providedIn: 'root'
})
/**
 * service containing the selected ship route and the loaded CSV routes
 */
export class RoutesService {
  /**
   * deliminators for reading the CSV
   */
  CSV_LINE_DELIMINATOR = "\n";
  CSV_COLUMN_DELIMINATOR = ",";
  /**
   *  Path to the csv Data
   */
  CSVPath = '../assets/routes.csv';
  /**
   * obsrevabe of all routes
   */
  shipRoutes: Observable<Array<Route>>;
  /**
   * Observable of the selected Ship Route
   */
  activeRoute: Observable<Route>;
  private  activeRouteSubject: Subject<Route>= new Subject<Route>();
  constructor(private http: HttpClient) {
    this.activeRoute = this.activeRouteSubject.asObservable();
    this.shipRoutes = this.loadRoutes(this.CSVPath, 5);
   }

  /**
  * selects aa route based on an index and updates the Subjct
  * @param id route ID
  */
  selectRouteById(id: number): void {
    this.shipRoutes.pipe(
      map((routes: Array<Route>) => routes.find(route=> route.routeId === id)),
      tap((route: Route | undefined) =>{
        if (route) {
          this.activeRouteSubject.next(route);
        }
      })
    ).subscribe();
  }

  private loadRoutes(csvPath: string, rowColumnCount?: number ): Observable<Array<Route>>{
    return this.http.get(csvPath, {responseType: 'text'})
    .pipe(
      map((data: string) => data.split(this.CSV_LINE_DELIMINATOR)),
      map((csvToRowArray: Array<string>) =>
         csvToRowArray
          .filter((row, index) => index > 0 && row)
          .map((row: string) => {
            const splitedColumns = this.splitStringToArray(row, rowColumnCount);
            return splitedColumns.map(col => JSON.parse(col));
          })
      ),
      map((rows: Array<Array<string>>) =>
        rows.map((row: Array<string>) =>{
          const routePointsArray: Array<Array<number>> = row[4] ? JSON.parse(row[4]) : [];
          const pointInstances =  routePointsArray
            .map(pointArray => new Point(pointArray[0],pointArray[1],new Date(pointArray[2]), pointArray[3]));
          return  new Route(Number(row[0]), row[1], row[2], Number(row[3]), pointInstances)
        })
      ),
      catchError(er => {
        console.error("Error loading the the CSV file -",er)
        return [];
      })
    );
  }
  private splitStringToArray(splittable: string , splitCount?: number): Array<string>{
    const splitedColumns = splittable.split(this.CSV_COLUMN_DELIMINATOR,splitCount ? splitCount -1: undefined);
    const lastColumnPosition = splitedColumns.join().length;
    const lastColumn = splittable.slice(lastColumnPosition + 1);
    splitedColumns.push(lastColumn);
    return splitedColumns;
  }
}
