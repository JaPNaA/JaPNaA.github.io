import CanvasElementPhysics from "./physics";
import absSum from "../../../utils/absSum";
import Dim from "../../../types/math/dim";

class DragPhysics extends CanvasElementPhysics {
    private static changeThreshold: number = 0.0001;

    private transitionSpeed: number;
    private initFlickSmoothing: number;
    private flickFriction: number;

    private totalDiff: number;

    private lastX: number;
    private tx: number;
    private vx: number;

    private lastY: number;
    private ty: number;
    private vy: number;

    private scale: number;
    private tscale: number;

    private dragging: boolean;
    private originalDim: Dim;
    private boundaries: Dim;

    constructor(transitionSpeed: number, initFlickSmoothing: number, flickFriction: number, originalDim: Dim, boundaries: Dim) {
        super();

        this.transitionSpeed = transitionSpeed;
        this.initFlickSmoothing = initFlickSmoothing;
        this.flickFriction = flickFriction;
        this.originalDim = originalDim;
        this.boundaries = boundaries;

        this.lastX = this.tx = 0;
        this.lastY = this.ty = 0;
        this.vx = 0;
        this.vy = 0;
        this.tscale = this.scale = 1;

        this.dragging = false;
        this.totalDiff = 0;
    }

    public teleportTo(x: number, y: number): void {
        this.tx = this.rect.x = x;
        this.ty = this.rect.y = y;
    }

    public setScale(scale: number): void {
        this.tscale = this.scale = scale;
    }

    public getScale(): number {
        return this.scale;
    }

    public zoomOutFrom(factor: number, x: number, y: number): void {
        this.zoomInto(1 / factor, x, y);
    }

    public zoomInto(factor: number, x: number, y: number): void {
        this.tscale *= factor;
        this.tx -= (x - this.tx) * (factor - 1);
        this.ty -= (y - this.ty) * (factor - 1);
    }

    public mouseMove(dx: number, dy: number): void {
        if (!this.dragging) { return; }
        this.tx += dx;
        this.ty += dy;
        this.rect.x += dx;
        this.rect.y += dy;
    }

    public mouseDown(): void {
        this.dragging = true;
    }

    public mouseUp(): void {
        this.dragging = false;
    }

    public normalizeResize(fromWidth: number, fromHeight: number, toWidth: number, toHeight: number): void {
        const dx = (toWidth - fromWidth) / 2;
        const dy = (toHeight - fromHeight) / 2;
        this.rect.x += dx;
        this.rect.y += dy;
        this.tx += dx;
        this.ty += dy;
    }

    public rectChanged(): boolean {
        return this.totalDiff > DragPhysics.changeThreshold;
    }

    public resetImageTransform(): void {
        if (this.originalDim.width <= this.boundaries.width && this.originalDim.height <= this.rect.height) {
            this.tscale = 1;
        } else {
            this.tscale = Math.min(
                this.rect.width / this.originalDim.width,
                this.rect.height / this.originalDim.height
            );
        }

        this.tx = (this.boundaries.width - this.originalDim.width * this.tscale) / 2;
        this.ty = (this.boundaries.height - this.originalDim.height * this.tscale) / 2;
    }

    public stopAnimations(): void {
        this.rect.x = this.tx;
        this.rect.y = this.ty;
        this.scale = this.tscale;
    }

    public setup(): void { }

    public tick(dt: number): void {
        const dx = this.tx - this.rect.x;
        const dy = this.ty - this.rect.y;
        const dscale = this.tscale - this.scale;

        this.rect.x += dx * this.transitionSpeed;
        this.rect.y += dy * this.transitionSpeed;
        this.scale += dscale * this.transitionSpeed;

        this.updateRectScale();

        if (this.dragging) {
            this.vx = (this.rect.x - this.lastX) * (1 - this.initFlickSmoothing) + this.vx * this.initFlickSmoothing;
            this.vy = (this.rect.y - this.lastY) * (1 - this.initFlickSmoothing) + this.vy * this.initFlickSmoothing;
            this.lastX = this.rect.x;
            this.lastY = this.rect.y;
        } else {
            this.vx *= this.flickFriction;
            this.vy *= this.flickFriction;
            this.rect.x += this.vx;
            this.rect.y += this.vy;
            this.tx += this.vx;
            this.ty += this.vy;
        }

        this.totalDiff = absSum([dx, dy, dscale, this.vx, this.vy]);
    }

    private updateRectScale(): void {
        this.rect.width = this.originalDim.width * this.scale;
        this.rect.height = this.originalDim.height * this.scale;
    }
}

export default DragPhysics;