import { Point2 } from './Point2';
import * as Util from '../util/Util';

export class Pivot2 extends Point2 {
    public static readonly center: Pivot2 = new Pivot2(0.5, 0.5);
    public static readonly topLeft: Pivot2 = new Pivot2(0, 0);
    public static readonly topCenter: Pivot2 = new Pivot2(0.5, 0);
    public static readonly topRight: Pivot2 = new Pivot2(1, 0);
    public static readonly centerLeft: Pivot2 = new Pivot2(0, 0.5);
    public static readonly centerRight: Pivot2 = new Pivot2(1, 0.5);
    public static readonly bottomLeft: Pivot2 = new Pivot2(0, 1);
    public static readonly bottomCenter: Pivot2 = new Pivot2(0.5, 1);
    public static readonly bottomRight: Pivot2 = new Pivot2(1, 1);

    public set(x?: number, y?: number): void {
        if (typeof x !== 'undefined') {
            x = Util.Math.clamp(x, 0, 1);
        }
        if (typeof y !== 'undefined') {
            y = Util.Math.clamp(y, 0, 1);
        }
        super.set(x, y);
    }

    public top(): void {
        this.set(this.x, 0);
    }

    public bottom(): void {
        this.set(this.x, 1);
    }

    public left(): void {
        this.set(0, this.y);
    }

    public right(): void {
        this.set(1, this.y);
    }
}
