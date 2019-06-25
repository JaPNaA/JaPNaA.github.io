import CanvasImage from "../../../components/canvas/canvasElements/canvasImage";
import DragPhysics from "../../../components/canvas/canvasElements/physics/drag";
import { Rect } from "../../../types/math/Rect";
import EventHandlers from "../../../core/utils/events/EventHandlers";
import Handler from "../../../core/utils/events/Handler";

class ImageViewImage {
    public physics: DragPhysics;
    public skyrimHandlers: EventHandlers;
    private image?: CanvasImage;
    private animateNextReset: boolean;
    private didSkyrim: boolean;

    private static zoomFactor: number = 1.2;

    constructor() {
        this.physics = new DragPhysics({
            transitionSpeed: 0.25,
            initFlickSmoothing: 0.3,
            flickFriction: 0.94
        });
        this.didSkyrim = false;
        this.skyrimHandlers = new EventHandlers();
        this.animateNextReset = false;
    }

    public onSkyrim(handler: Handler): void {
        this.skyrimHandlers.add(handler);
    }

    public offSkyrim(handler: Handler): void {
        this.skyrimHandlers.remove(handler);
    }

    public setImage(image: HTMLImageElement): void {
        this.image = new CanvasImage(0, 0, image);
        this.image.attachPhysics(this.physics);
    }

    public tick(deltaTime: number): void {
        if (this.image) {
            this.image.tick(deltaTime);
        }
    }

    public draw(X: CanvasRenderingContext2D): void {
        if (!this.image) { return; }

        X.imageSmoothingEnabled = this.getScale() < 3;

        if (this.getScale() > 40e6) {
            this.startSkyrim();
        }

        X.save();

        // box-shadow: 0px 12px 32px rgba(0, 0, 0, 0.40), similar to @box-shadow-24dp
        X.shadowColor = "rgba(0,0,0,0.40)";
        X.shadowBlur = 8;
        X.shadowOffsetX = 0;
        X.shadowOffsetY = 12;

        this.image.draw(X);

        X.restore();
    }

    public setInitalTransform(x: number, y: number, scale: number): void {
        this.physics.teleportTo(x, y);
        this.physics.setScale(scale);
        this.animateNextReset = true;
    }

    public zoom(dist: number, x: number, y: number): void {
        if (!this.physics) { return; }
        if (dist > 0) {
            this.physics.zoomOutFrom(ImageViewImage.zoomFactor, x, y);
        } else {
            this.physics.zoomInto(ImageViewImage.zoomFactor, x, y);
        }
    }

    /** Alternates between the scale being 1 and zooming to fit */
    public alternateFitToReal(x: number, y: number): void {
        if (this.physics.getScale() < 1) {
            this.physics.zoomToScale(1, x, y);
        } else {
            this.physics.resetImageTransform();
        }
    }

    public resetImageTransform(): void {
        this.physics.resetImageTransform();
        if (!this.animateNextReset) {
            this.physics.stopAnimations();
            this.animateNextReset = true;
        }
    }

    public getRect(): Rect | undefined {
        return this.image && this.image.getRect();
    }

    private startSkyrim(): void {
        if (this.didSkyrim) { return; }
        this.skyrimHandlers.dispatch();
        this.didSkyrim = true;
    }

    private getScale(): number {
        return this.physics.getScale();
    }
}

export default ImageViewImage;