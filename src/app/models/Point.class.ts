/**
 * class Representing the ships routes path using GPS points
 */
export class Point {
    constructor(
    /**
     * point longitude
     */
    public longitude: number,
    /**
     * point latitude
     */
    public latitude: number,
    /**
     * GPS reading timestamp
     */
    public timestamp: Date,
    /**
     * ships speed in Knot
     */
    public speed: number) {}
}
