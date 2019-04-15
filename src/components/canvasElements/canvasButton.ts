import absSum from "../../utils/absSum";
import CanvasElement from "./canvasElement";

class CanvasButton extends CanvasElement {
    private static redrawThreshold: number = 0.0001;

    private tx: number;
    private ty: number;
    private totalDiff: number;

    private transitionSpeed: number;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.tx = x;
        this.ty = y;
        this.transitionSpeed = 0.25;
        this.totalDiff = 0;
    }

    public tick(dt: number): void {
        const dx = this.tx - this.x;
        const dy = this.ty - this.y;
        this.x += dx * this.transitionSpeed;
        this.y += dy * this.transitionSpeed;
        this.totalDiff = absSum([dx, dy]);
    }

    public moveTo(x: number, y: number) {
        this.tx = x;
        this.ty = y;
    }

    public teleportTo(x: number, y: number) {
        this.tx = this.x = x;
        this.ty = this.y = y;
    }

    public shouldRedraw(): boolean {
        return this.totalDiff > CanvasButton.redrawThreshold;
    }

    public draw(X: CanvasRenderingContext2D) {
        X.fillStyle = "#ff0000";
        X.fillRect(this.x, this.y, this.width, this.height);
    }
}

export default CanvasButton;