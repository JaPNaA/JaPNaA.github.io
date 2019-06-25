import { Rect, newRect } from "../../../../types/math/Rect";

abstract class CanvasElementPhysics {
    protected rect: Rect;

    constructor() {
        this.rect = newRect();
    }

    public abstract tick(dt: number): void;
    public abstract onDraw(): void;
    public abstract hasRectChanged(): boolean;
    protected abstract onAttach(oldRect: Rect): void;

    public init(rect: Rect): void {
        const oldRect = this.rect;
        this.rect = rect;
        this.onAttach(oldRect);
    }
}

export default CanvasElementPhysics;