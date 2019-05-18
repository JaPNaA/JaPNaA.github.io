import CanvasImage from "../../../../components/canvasElements/canvasImage";
import DragPhysics from "../../../../components/canvasElements/physics/drag";
import { Rect } from "../../../../types/math/rect";

class ImageViewImage {
    public physics: DragPhysics;
    private image?: CanvasImage;
    private animateNextReset: boolean;

    private static zoomFactor: number = 1.2;

    constructor() {
        this.physics = new DragPhysics({
            transitionSpeed: 0.25,
            initFlickSmoothing: 0.3,
            flickFriction: 0.94
        });
        this.animateNextReset = false;
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
        // at some point, when it's zoomed in enough, open the skyrim intro, if the meme is still relevant
        // <iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/RrjJtYpOawU?start=61&autoplay=1&mute=1&controls=0&disablekb=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

        X.save();

        X.shadowColor = "rgba(0,0,0,0.35)";
        X.shadowBlur = 8;
        X.shadowOffsetX = 0;
        X.shadowOffsetY = 4;

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

    private getScale(): number {
        return this.physics.getScale();
    }
}

export default ImageViewImage;