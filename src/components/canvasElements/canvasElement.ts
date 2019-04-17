import CanvasElementPhysics from "./physics/physics";
import { Rect } from "../../types/math/rect";

abstract class CanvasElement {
    protected rect: Rect;
    protected physics?: CanvasElementPhysics;

    constructor(x: number, y: number, width: number, height: number) {
        this.rect = {
            x: x,
            y: y,
            width: width,
            height: height
        };
    }

    public abstract shouldRedraw(): boolean;

    public draw(X: CanvasRenderingContext2D): void {
        if (this.physics) { this.physics.onDraw(); }
    }

    public tick(dt: number): void {
        this.applyPhysics(dt);
    }

    public attachPhysics(physics: CanvasElementPhysics) {
        this.physics = physics;
        this.physics.init(this.rect);
    }

    public getRect(): Rect {
        return this.rect;
    }

    protected applyPhysics(dt: number): void {
        if (!this.physics) { return; }
        this.physics.tick(dt);
    }
}

export default CanvasElement;