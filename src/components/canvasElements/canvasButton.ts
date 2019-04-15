import absSum from "../../utils/absSum";
import CanvasElement from "./canvasElement";

class CanvasButton extends CanvasElement {
    private static redrawThreshold: number = 0.0001;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
    }

    public tick(dt: number): void {
        super.tick(dt);
    }

    public shouldRedraw(): boolean {
        if (this.physics) {
            return this.physics.rectChanged();
        } else {
            return false;
        }
    }

    public draw(X: CanvasRenderingContext2D) {
        X.fillStyle = "#ff0000";
        X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

export default CanvasButton;