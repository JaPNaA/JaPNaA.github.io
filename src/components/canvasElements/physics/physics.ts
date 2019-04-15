import Rect from "../../../types/rect";

abstract class CanvasElementPhysics {
    protected rect!: Rect;

    public abstract tick(dt: number): void;
    public abstract rectChanged(): boolean;
    public abstract setup(): void;

    public init(rect: Rect): void {
        this.rect = rect;
        this.setup();
    }
}

export default CanvasElementPhysics;