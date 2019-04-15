import CanvasElementPhysics from "./physics/physics";
import Rect from "../../types/rect";

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

    public abstract draw(X: CanvasRenderingContext2D): void;
    public abstract shouldRedraw(): boolean;

    public tick(dt: number): void {
        this.applyPhysics(dt);
    }

    public applyPhysics(dt: number): void {
        if (!this.physics) { return; }
        this.physics.tick(dt);
    }

    public setPhysics(physics: CanvasElementPhysics) {
        this.physics = physics;
        this.physics.init(this.rect);
    }
}

export default CanvasElement;