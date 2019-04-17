import CanvasElementPhysics from "./physics";
import absSum from "../../../utils/absSum";
import { Dim, newDim } from "../../../types/math/dim";
import { Rect } from "../../../types/math/rect";

class DragPhysics extends CanvasElementPhysics {
    private static changeThreshold: number = 0.0001;

    private transitionSpeed: number;
    private initFlickSmoothing: number;
    private flickFriction: number;

    private lastX: number;
    private tx: number;
    private vx: number;

    private lastY: number;
    private ty: number;
    private vy: number;

    private scale: number;
    private tscale: number;

    private dragging: boolean;
    private userAdjusted: boolean;
    private imageDim: Dim;
    private bounds: Dim;

    private isCurrRenderDirty: boolean;

    constructor(options: {
        transitionSpeed: number, initFlickSmoothing: number, flickFriction: number
    }) {
        super();

        this.transitionSpeed = options.transitionSpeed;
        this.initFlickSmoothing = options.initFlickSmoothing;
        this.flickFriction = options.flickFriction;
        this.imageDim = newDim();
        this.bounds = newDim();

        this.lastX = this.tx = 0;
        this.lastY = this.ty = 0;
        this.vx = 0;
        this.vy = 0;
        this.tscale = this.scale = 1;

        this.dragging = false;
        this.userAdjusted = false;
        this.isCurrRenderDirty = true;
    }

    public tick(dt: number): void {
        const dx = this.tx - this.rect.x;
        const dy = this.ty - this.rect.y;
        const dscale = this.tscale - this.scale;

        this.rect.x += dx * this.transitionSpeed;
        this.rect.y += dy * this.transitionSpeed;
        this.scale += dscale * this.transitionSpeed;

        this.updateRectScale();

        if (this.dragging) {
            // TODO: BUG: init flick smoothing takes in account clicks
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
    }

    public onDraw(): void {
        this.isCurrRenderDirty = false;
    }

    public teleportTo(x: number, y: number): void {
        this.tx = this.rect.x = x;
        this.ty = this.rect.y = y;
    }

    public getScale(): number {
        return this.scale;
    }

    public setScale(scale: number): void {
        this.tscale = this.scale = scale;
    }

    public resize(width: number, height: number): void {
        const oldWidth = this.bounds.width;
        const oldHeight = this.bounds.height;

        this.bounds.width = width;
        this.bounds.height = height;

        if (this.userAdjusted) {
            this.normalizeResize(oldWidth, oldHeight, width, height);
        } else {
            this.resetImageTransform();
        }

        this.preventTransition();
    }

    public hasRectChanged(): boolean {
        return this.isCurrRenderDirty || absSum([
            this.tx - this.rect.x,
            this.ty - this.rect.y,
            this.tscale - this.scale,
            this.vx,
            this.vy
        ]) > DragPhysics.changeThreshold;
    }

    public zoomOutFrom(factor: number, x: number, y: number): void {
        this.zoomInto(1 / factor, x, y);
    }

    public zoomInto(factor: number, x: number, y: number): void {
        this.tscale *= factor;
        this.tx -= (x - this.tx) * (factor - 1);
        this.ty -= (y - this.ty) * (factor - 1);
        this.userAdjusted = true;
        this.isCurrRenderDirty = true;
    }

    public mouseMove(dx: number, dy: number): void {
        if (!this.dragging) { return; }
        this.tx += dx;
        this.ty += dy;
        this.rect.x += dx;
        this.rect.y += dy;
        this.userAdjusted = true;
        this.isCurrRenderDirty = true;
    }

    public mouseDown(): void {
        this.dragging = true;
    }

    public mouseUp(): void {
        this.dragging = false;
    }

    public resetImageTransform(): void {
        if (this.imageDim.width <= this.bounds.width && this.imageDim.height <= this.bounds.height) {
            this.tscale = 1;
        } else {
            this.tscale = Math.min(
                this.bounds.width / this.imageDim.width,
                this.bounds.height / this.imageDim.height
            );
        }

        this.tx = (this.bounds.width - this.imageDim.width * this.tscale) / 2;
        this.ty = (this.bounds.height - this.imageDim.height * this.tscale) / 2;
        this.userAdjusted = false;
        this.isCurrRenderDirty = true;
    }

    public stopAnimations(): void {
        this.rect.x = this.tx;
        this.rect.y = this.ty;
        this.scale = this.tscale;
    }

    protected onAttach(oldRect: Rect): void {
        this.rect.x = oldRect.x;
        this.rect.y = oldRect.y;
        this.setImageSize(this.rect.width, this.rect.height);
        this.updateRectScale();
    }

    private setImageSize(width: number, height: number): void {
        this.imageDim.width = width;
        this.imageDim.height = height;
        this.isCurrRenderDirty = true;
    }

    private normalizeResize(fromWidth: number, fromHeight: number, toWidth: number, toHeight: number): void {
        if (!this.rect) { return; }
        const dx = (toWidth - fromWidth) / 2;
        const dy = (toHeight - fromHeight) / 2;
        this.rect.x += dx;
        this.rect.y += dy;
        this.tx += dx;
        this.ty += dy;
    }

    private updateRectScale(): void {
        this.rect.width = this.imageDim.width * this.scale;
        this.rect.height = this.imageDim.height * this.scale;
    }

    private preventTransition(): void {
        this.rect.x = this.tx;
        this.rect.y = this.ty;
        this.scale = this.tscale;
    }
}

export default DragPhysics;