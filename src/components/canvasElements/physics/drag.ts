import CanvasElementPhysics from "./physics";
import absSum from "../../../utils/math/absSum";
import { Dim, newDim } from "../../../types/math/dim";
import { Rect } from "../../../types/math/rect";

class DragPhysics extends CanvasElementPhysics {
    private static changeThreshold: number = 0.0001;
    private static padding: number = 16;

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
    private zooming: boolean;
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
        this.zooming = false;
        this.userAdjusted = false;
        this.isCurrRenderDirty = true;
    }

    public tick(dt: number): void {
        const dx: number = this.tx - this.rect.x;
        const dy: number = this.ty - this.rect.y;
        const dscale: number = this.tscale - this.scale;

        this.constrainToBounds();

        this.rect.x += dx * this.transitionSpeed;
        this.rect.y += dy * this.transitionSpeed;
        this.scale += dscale * this.transitionSpeed;

        this.updateRectScale();

        if (this.dragging) {
            if (!this.zooming) {
                this.vx = (this.rect.x - this.lastX) * (1 - this.initFlickSmoothing) + this.vx * this.initFlickSmoothing;
                this.vy = (this.rect.y - this.lastY) * (1 - this.initFlickSmoothing) + this.vy * this.initFlickSmoothing;
            }
        } else {
            this.vx *= this.flickFriction;
            this.vy *= this.flickFriction;
            this.rect.x += this.vx;
            this.rect.y += this.vy;
            this.tx += this.vx;
            this.ty += this.vy;
        }

        this.lastX = this.rect.x;
        this.lastY = this.rect.y;
    }

    private constrainToBounds(): void {
        const twidth: number = this.tscale * this.imageDim.width;
        const theight: number = this.tscale * this.imageDim.height;

        if (this.ty > this.bounds.height - DragPhysics.padding) {
            this.ty = this.bounds.height - DragPhysics.padding;
        } else if (this.ty < DragPhysics.padding - theight) {
            this.ty = DragPhysics.padding + -theight;
        }

        if (this.tx > this.bounds.width - DragPhysics.padding) {
            this.tx = this.bounds.width - DragPhysics.padding;
        } else if (this.tx < DragPhysics.padding + -twidth) {
            this.tx = DragPhysics.padding + -twidth;
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
        return this.tscale;
    }

    public setScale(scale: number): void {
        this.tscale = this.scale = scale;
    }

    public resize(width: number, height: number): void {
        const oldWidth: number = this.bounds.width;
        const oldHeight: number = this.bounds.height;

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

    public zoomToScale(scale: number, x: number, y: number): void {
        this.zoomInto(scale / this.tscale, x, y);
        // this.tscale = scale;
    }

    public zoomOutFrom(factor: number, x: number, y: number): void {
        this.zoomInto(1 / factor, x, y);
    }

    public zoomInto(factor: number, x: number, y: number): void {
        this.tscale *= factor;
        this.tx -= (x - this.tx) * (factor - 1);
        this.ty -= (y - this.ty) * (factor - 1);
        this.zooming = true;
        this.userAdjusted = true;
        this.isCurrRenderDirty = true;
    }

    public dragIfDragging(dx: number, dy: number): void {
        if (!this.dragging) { return; }
        this.drag(dx, dy);
    }

    public drag(dx: number, dy: number): void {
        this.tx += dx;
        this.ty += dy;
        this.rect.x += dx;
        this.rect.y += dy;
        this.userAdjusted = true;
        this.isCurrRenderDirty = true;
    }

    public startDrag(): void {
        this.zooming = false;
        this.dragging = true;
    }

    public endDrag(): void {
        this.zooming = false;
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
        this.vx = 0;
        this.vy = 0;
        this.userAdjusted = false;
        this.isCurrRenderDirty = true;
    }

    public stopAnimations(): void {
        this.lastX = this.rect.x = this.tx;
        this.lastY = this.rect.y = this.ty;
        this.vx = 0;
        this.vy = 0;
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
        const dx: number = (toWidth - fromWidth) / 2;
        const dy: number = (toHeight - fromHeight) / 2;
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