import { Point } from "./Point.class";
/**
 * Class representing the Ship Routes
 */
export class Route {
    constructor(
      /**
       * Route ID
       */
        public  routeId: number,
        /**
         * route origin
         */
        public routeOrigin: string,
        /**
         * route destination
         */
        public routeTarget: string,
        /**
         *  trip duration in milliseconds
         */
        public duration: number,
        /**
         * Array of vessel observations from GPS
         */
        public points: Array<Point>){}

  /**
   * helper function to aquire the GPS point from index
   * @param wantedIndex points index
   * @returns the GPS Point reading
   */
  getPointAtIndex(wantedIndex: number | undefined): Point | undefined{
    return this.points.find((_,index) => index === wantedIndex);
  }

}
