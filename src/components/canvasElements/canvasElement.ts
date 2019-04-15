abstract class CanvasElement {
    protected x: number;
    protected y: number;
    protected width: number;
    protected height: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public abstract tick(dt: number): void;
    public abstract draw(X: CanvasRenderingContext2D): void;
    public abstract shouldRedraw(): boolean;
}

export default CanvasElement;