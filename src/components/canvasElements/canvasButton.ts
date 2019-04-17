import CanvasElement from "./canvasElement";
import EventHandlers from "../../utils/events/eventHandlers";
import Handler from "../../utils/events/handler";

class CanvasButton extends CanvasElement {
    private clickHandlers: EventHandlers;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, width, height);
        this.clickHandlers = new EventHandlers();
    }

    public tick(dt: number): void {
        super.tick(dt);
    }

    public shouldRedraw(): boolean {
        if (this.physics) {
            return this.physics.hasRectChanged();
        } else {
            return false;
        }
    }

    public onClick(handler: Handler): void {
        this.clickHandlers.add(handler);
    }

    public offClick(handler: Handler): void {
        this.clickHandlers.remove(handler);
    }

    public checkClick(x: number, y: number): void {
        if (
            x >= this.rect.x &&
            y >= this.rect.y &&
            x <= this.rect.x + this.rect.width &&
            y <= this.rect.y + this.rect.height
        ) {
            this.clickHandlers.dispatch();
        }
    }

    public draw(X: CanvasRenderingContext2D): void {
        super.draw(X);
        X.fillStyle = "#ff0000";
        X.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
}

export default CanvasButton;